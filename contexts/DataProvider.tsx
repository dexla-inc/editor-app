import { createContext, useContext } from "react";
import { useVariableStore } from "@/stores/variables";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { AuthState, useDataSourceStore } from "@/stores/datasource";
import get from "lodash.get";
import { ValueProps } from "@/utils/types";

type DataProviderProps = {
  children: React.ReactNode;
};

type GetValueProps = {
  value?: ValueProps;
  shareableContent?: any;
};

type DataContextProps = {
  variables: { list: Record<string, any> };
  components: { list: Record<string, any> };
  browserList: any[];
  auth: AuthState & { refreshToken?: string }[];
  computeValue: (props: GetValueProps) => any;
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
  const editorTree = useEditorStore((state) => state.tree);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const browser = useRouter();
  const auth = useDataSourceStore((state) => [state.getAuthState()]);

  const variables = variablesList.reduce(
    (acc, variable) => {
      let value = variable.defaultValue ?? "";
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

  const browserList = Object.entries(
    pick(browser, ["asPath", "basePath", "pathname", "query", "route"]),
  ).map(([key, value]) => {
    const isObject = typeof value === "object";
    return {
      id: key,
      name: key,
      value: isObject ? JSON.stringify(value) : value,
      type: isObject ? "OBJECT" : "STRING",
    };
  }) as any;

  const autoRunJavascriptCode = (boundCode: string) => {
    try {
      return eval(`(function () { ${boundCode} })`)();
    } catch {
      return "undefined";
    }
  };

  const computeValue = ({ value, shareableContent }: GetValueProps) => {
    if (!value) {
      return;
    }

    let dataType = value?.dataType ?? "static";

    const valueHandlers = {
      dynamic: () => {
        return get(shareableContent, `data.${value?.dynamic}`, value?.dynamic);
      },
      static: () => get(value, "static", value?.value),
      boundCode: () => autoRunJavascriptCode(value?.boundCode),
    };

    return valueHandlers[dataType]();
  };

  return (
    <DataContext.Provider
      value={{
        variables,
        components,
        browserList,
        auth,
        computeValue,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
