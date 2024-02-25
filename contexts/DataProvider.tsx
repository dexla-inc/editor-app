import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useAppMode } from "@/hooks/useAppMode";
import { AuthState, useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { isObject, jsonInString, safeJsonParse } from "@/utils/common";
import { getAllComponentsByName } from "@/utils/editor";
import { ValueProps } from "@/utils/types";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { useNodes } from "reactflow";

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
  actions: { list: Record<string, any> };
  browserList: any[];
  auth: AuthState & { refreshToken?: string };
  computeValue: (props: GetValueProps) => any;
  computeValues: (props: GetValuesProps) => any;
  setNonEditorActions: any;
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
  const variablesList = useVariableStore((state) => state.variableList); // Is this persisted store required any longer?
  const editorTree = useEditorStore((state) => state.tree);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const browser = useRouter();
  const auth = useDataSourceStore((state) => state.getAuthState());
  const nodes = useNodes<NodeData>();
  const projectId = useEditorStore((state) => state.currentProjectId ?? "");
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const [nonEditorActions, setNonEditorActions] = useState<Record<string, any>>(
    {},
  );
  const { isPreviewMode } = useAppMode();
  const isLive = useEditorStore((state) => state.isLive);
  const isEditorMode = !isPreviewMode && !isLive;

  const actions = nodes.reduce(
    (acc, node) => {
      const { action, endpoint: endpointId } = node.data.form ?? {};
      if (action === "apiCall" && endpointId) {
        const endpoint = endpoints?.results.find((e) => e.id === endpointId);

        const successExampleResponse = safeJsonParse(
          endpoint?.exampleResponse ?? "",
        );
        const errorExampleResponse = safeJsonParse(
          endpoint?.errorExampleResponse ?? "",
        );

        const success = isEditorMode
          ? successExampleResponse
          : nonEditorActions[node.id]?.success;

        const error = isEditorMode
          ? errorExampleResponse
          : nonEditorActions[node.id]?.error;

        acc.list[node.id] = merge({}, endpoint, {
          id: node.id,
          name: node.data.label,
          success,
          error,
        });
        acc[node.id] = {
          success,
          error,
        };
      }

      return acc;
    },
    { list: {} } as any,
  );

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

  const components = getAllComponentsByName(editorTree.root, [
    "Input",
    "Select",
    "Checkbox",
    "RadioGroup",
    "Switch",
    "Textarea",
    "Autocomplete",
  ]).reduce(
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

  const autoRunJavascriptCode = (boundCode: string) => {
    try {
      const result = eval(`(function () { ${boundCode} })`)();
      return isEmpty(result) ? result : result.toString();
    } catch {
      return;
    }
  };

  const computeValue = ({
    value,
    shareableContent,
    staticFallback,
  }: GetValueProps) => {
    let dataType = value?.dataType ?? "static";

    const valueHandlers = {
      dynamic: () => {
        return get(shareableContent, `data.${value?.dynamic}`, value?.dynamic);
      },
      static: () => {
        // Attempt to parse the static value if it looks like a JSON string
        if (value && jsonInString(value)) {
          return safeJsonParse(value.static);
        }
        return get(value, "static", staticFallback);
      },
      boundCode: () => {
        let boundCode = value?.boundCode?.trim() ?? "";
        let hasReturn = boundCode.startsWith("return");

        if (hasReturn) {
          boundCode = boundCode.substring(6).trim();

          if (jsonInString(boundCode)) {
            boundCode = safeJsonParse(boundCode);
          }
        }

        // Unable to return objects as `return ${boundCode}` implicitly calls toString() so Current Value
        // does not get returned in BindingPopover
        return autoRunJavascriptCode(
          hasReturn ? `return ${boundCode}` : boundCode,
        );
      },
    };

    return valueHandlers[dataType]();
  };

  const computeValues = ({ value, shareableContent }: any): any => {
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
        actions,
        computeValue,
        computeValues,
        setNonEditorActions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
