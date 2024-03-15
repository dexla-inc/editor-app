import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useAppMode } from "@/hooks/useAppMode";
import { AuthState, useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { APICallAction } from "@/utils/actions";
import { isObject, jsonInString, safeJsonParse } from "@/utils/common";
import { ValueProps } from "@/utils/types";
import get from "lodash.get";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect } from "react";
import { useNodes } from "reactflow";
import { Component } from "@/utils/editor";
import { memoize } from "proxy-memoize";

type DataProviderProps = {
  children: React.ReactNode;
};

export type GetValueProps = {
  value?: ValueProps;
  shareableContent?: any;
  staticFallback?: string;
};

export type GetValuesProps = {
  value?: Array<ValueProps>;
  shareableContent?: any;
  staticFallback?: string;
};

type DataContextProps = {
  variables: { list: Record<string, any> };
  components: { list: Record<string, any> };
  browserList: any[];
  auth: AuthState & { refreshToken?: string };
  computeValue: (props: GetValueProps) => any;
  computeValues: (props: GetValuesProps) => any;
};

const parseVariableValue = (value: string): any => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
};

const processValue = (value: any, type: string) => {
  return type === "STRING" ? value.toString() : value;
};

export const DataContext = createContext<DataContextProps | null>(null);

export const DataProvider = ({ children }: DataProviderProps) => {
  const variablesList = useVariableStore((state) => state.variableList);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const browser = useRouter();
  const auth = useDataSourceStore((state) => state.getAuthState());
  const projectId = useEditorTreeStore((state) => state.currentProjectId ?? "");
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  const allInputComponents = useEditorTreeStore(
    memoize((state) =>
      Object.values(state.componentMutableAttrs).reduce((acc, c) => {
        const isInput = [
          "Input",
          "Select",
          "Checkbox",
          "RadioGroup",
          "Switch",
          "Textarea",
          "Autocomplete",
        ].includes(c?.name!);
        if (isInput) {
          acc.push({ id: c.id, description: c.name });
        }
        return acc;
      }, [] as Partial<Component>[]),
    ),
  );

  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );

  useEffect(() => {
    if (endpoints?.results) {
      setApiAuthConfig(endpoints.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints?.results]);

  const variables = variablesList.reduce(
    (acc, variable) => {
      let value = variable.value ?? variable.defaultValue ?? "";
      const parsedValue = parseVariableValue(value);
      const processedValue = processValue(parsedValue, variable.type);

      acc.list[variable.id] = variable;
      acc[variable.id] = processedValue;
      acc[variable.name] = processedValue;
      return acc;
    },
    { list: {} } as any,
  );

  const components = allInputComponents.reduce(
    (acc, component) => {
      const value = inputsStore[component?.id!];
      component = { ...component, name: component.description! };
      acc.list[component?.id!] = component;
      acc[component?.id!] = value;
      return acc;
    },
    { list: {} } as any,
  );

  const browserList = Array.of(
    pick(browser, ["asPath", "basePath", "pathname", "query", "route"]),
  );

  const computeValue = (
    { value, shareableContent, staticFallback }: GetValueProps,
    ctx?: any,
  ) => {
    if (value === undefined) return staticFallback || undefined;
    let dataType = value?.dataType ?? "static";

    const valueHandlers = {
      dynamic: () => {
        return get(shareableContent, `data.${value?.dynamic}`, value?.dynamic);
      },
      static: () => {
        return get(value, "static", staticFallback);
      },
      boundCode: () => {
        let boundCode = value?.boundCode?.trim() ?? "";
        let hasReturn = boundCode.startsWith("return");

        if (hasReturn) {
          boundCode = boundCode.substring(6).trim();

          // This is needed when the boundCode is a stringified static object with a return statement
          if (jsonInString(boundCode)) {
            boundCode = safeJsonParse(boundCode);
          }
        }

        return autoRunJavascriptCode(
          hasReturn ? `return ${boundCode}` : boundCode,
          ctx,
        );
      },
    };

    return valueHandlers[dataType]();
  };

  const autoRunJavascriptCode = (boundCode: string, ctx: any) => {
    const { actions } = ctx ?? {};
    try {
      const result = eval(`(function () { ${boundCode} })`)();
      return result;
    } catch (error: any) {
      console.error(error);
      return;
    }
  };

  const computeValues = ({
    value,
    shareableContent,
    staticFallback,
  }: any): any => {
    if (!value) return {};
    const keys = Object.keys(value);

    // Modified processValue function to handle nested objects correctly
    const processValue = (currentValue: any) => {
      // Check if the current value is a plain object
      if (isObject(currentValue)) {
        // Special handling for objects that directly contain a "static" property
        if ("static" in currentValue || "dataType" in currentValue) {
          // Directly process values that have a "static" or "dataType" property
          return computeValue({
            value: currentValue,
            shareableContent,
            staticFallback,
          });
        } else {
          // If it's a nested object without "static" or "dataType", process each key
          return Object.keys(currentValue).reduce(
            (acc, key) => {
              acc[key] = processValue(currentValue[key]);
              return acc;
            },
            {} as Record<string, any>,
          );
        }
      } else {
        // For non-object values, just return the value as is
        return currentValue;
      }
    };

    // Reduce function to compute values for all keys in the object
    const computedValues = keys.reduce(
      (acc, key) => {
        acc[key] = processValue(value[key]);
        return acc;
      },
      {} as Record<string, any>,
    );

    return computedValues;
  };

  return (
    <DataContext.Provider
      value={{
        variables,
        components,
        browserList,
        auth,
        computeValue,
        computeValues,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
