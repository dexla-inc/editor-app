import { AuthState, useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { getAllComponentsByName } from "@/utils/editor";
import { ValueProps } from "@/utils/types";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";

type DataProviderProps = {
  children: React.ReactNode;
};

export type GetValueProps = {
  value?: ValueProps;
  shareableContent?: any;
  staticFallback?: string;
};

type DataContextProps = {
  variables: { list: Record<string, any> };
  components: { list: Record<string, any> };
  browserList: any[];
  auth: AuthState & { refreshToken?: string };
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
  const variablesList = useVariableStore((state) => state.variableList); // Is this persisted store required any longer?
  const editorTree = useEditorStore((state) => state.tree);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const browser = useRouter();
  const auth = useDataSourceStore((state) => state.getAuthState());

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
      static: () => get(value, "static", staticFallback),
      boundCode: () => autoRunJavascriptCode(value?.boundCode ?? ""),
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
