import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { debouncedTreeUpdate, getAllComponentsByName } from "@/utils/editor";
import { useDisclosure } from "@mantine/hooks";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { useState } from "react";

export type Category = "data" | "actions" | "changeVariable" | "appearance";

type VariableProps = {
  item: string;
  category: Category;
  onPickVariable: any;
  javascriptCode: string;
};

type VariableTypeProps = Omit<VariableProps, "javascriptCode"> & {
  parsed?: any;
  isObjectType?: boolean;
  error?: boolean;
};

type ComponentsType = {
  item: string;
  javascriptCode: string;
  onPickComponent: any;
};

type BindType = {
  item: string;
  javascriptCode: string;
  onPick: any;
};

const prefixWithReturnIfNeeded = (code: string) =>
  !code?.startsWith("return") ? "return " : " ";

export const useBindingPopover = () => {
  const [opened, { toggle, close, open }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<string>();
  const editorTree = useEditorStore((state) => state.tree);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const variablesList = useVariableStore((state) => state.variableList);
  const getAuthState = useDataSourceStore((state) => state.getAuthState);
  const browser = useRouter();
  const auth = getAuthState();

  // create variables list for binding
  const variables = variablesList.reduce(
    (acc, variable) => {
      let value = variable.defaultValue;
      const isText = variable.type === "TEXT";
      const isBoolean = variable.type === "BOOLEAN";
      const parsedValue =
        value && (isText || isBoolean ? value : JSON.parse(value));
      acc.list[variable.id] = variable;
      acc[variable.id] = parsedValue;
      acc[variable.name] = parsedValue;
      return acc;
    },
    { list: {} } as Record<string, any>,
  );

  // create a list for input components for binding
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
    { list: {} } as Record<string, any>,
  );

  // create browser list for binding
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
  });

  // create auth list for binding
  const authData = ([] as any[]).concat([auth]);

  const handleVariableType = ({
    item,
    parsed,
    isObjectType,
    error,
    category,
    onPickVariable,
  }: VariableTypeProps) => {
    if (category === "actions") {
      !error &&
        onPickVariable(
          isObjectType
            ? `var_${JSON.stringify({
                id: parsed.id,
                variable: variables?.list[parsed.id],
                path: parsed.path,
              })}`
            : `var_${variables?.list[parsed.id].name}`,
        );
      error && onPickVariable(`var_${variables?.list[item].name}`);
    }
    if (category === "data") {
      onPickVariable(variables?.list[item].id);
    }

    if (category === "changeVariable") {
      onPickVariable(`var_${variables?.list[item].name}`);
    }
  };

  const handleVariables = ({
    item,
    category,
    onPickVariable,
    javascriptCode,
  }: VariableProps) => {
    try {
      const parsed = JSON.parse(item);
      const isObjectType =
        typeof parsed === "object" || variables[parsed.id].type === "OBJECT";
      const pathStartsWithBracket = parsed.path.startsWith("[") ? "" : ".";
      setSelectedItem(
        `${prefixWithReturnIfNeeded(javascriptCode)}variables[/* ${
          variables[parsed.id].name
        } */'${parsed.id}']${pathStartsWithBracket}${parsed.path}`,
      );
      onPickVariable &&
        handleVariableType({
          item,
          parsed,
          isObjectType,
          onPickVariable,
          category,
        });
    } catch {
      setSelectedItem(
        `${prefixWithReturnIfNeeded(javascriptCode)}variables[/* ${variables
          ?.list[item].name} */'${item}']`,
      );
      onPickVariable &&
        handleVariableType({ item, error: true, onPickVariable, category });
    }
  };

  const handleContext =
    (context: "auth" | "components" | "browser" | "actions") =>
    ({ item, onPick, javascriptCode }: BindType) => {
      const pickedItem = context === "components" ? item : `${context}_${item}`;
      const contextDescription =
        context === "components"
          ? "/* ${inputComponents?.list[item].description} */"
          : "";
      try {
        const parsed = JSON.parse(item);
        setSelectedItem(
          `${prefixWithReturnIfNeeded(
            javascriptCode,
          )}${context}[${contextDescription}'${parsed.id}'].${parsed.path}`,
        );
      } catch {
        setSelectedItem(
          `${prefixWithReturnIfNeeded(
            javascriptCode,
          )}${context}[${contextDescription}'${item}']`,
        );
      } finally {
        onPick && onPick(pickedItem);
      }
    };

  const getSelectedVariable = (id: string) =>
    variablesList.find((varItem) => varItem.id === id);

  const handleValueUpdate = (id: string, variable: any, key = "children") => {
    if (variable) {
      debouncedTreeUpdate(id, {
        [key]: variable.defaultValue,
      });
    }
  };

  const handleValuesUpdate = (id: string, values: Record<string, any>) => {
    debouncedTreeUpdate(id, values);
  };

  const bindingPopoverProps = {
    opened,
    toggle,
    close,
    open,
    variables,
    components,
    browserList,
    handleVariables,
    selectedItem,
    getSelectedVariable,
    variablesList,
    handleValueUpdate,
    handleValuesUpdate,
    authData,
    bindableContexts: [components, auth],
    handleContext,
  };

  return bindingPopoverProps;
};
