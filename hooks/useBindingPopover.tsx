import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { getAllComponentsByName } from "@/utils/editor";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { useState } from "react";

type BindType = {
  selectedEntityId: string;
  entity: "auth" | "components" | "browser" | "variables";
};

const prefixWithReturnIfNeeded = (code: string) =>
  !code?.startsWith("return") ? "return " : " ";

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

export const useBindingPopover = () => {
  const [selectedItem, setSelectedItem] = useState<string>();
  const editorTree = useEditorStore((state) => state.tree);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const variablesList = useVariableStore((state) => state.variableList);
  const getAuthState = useDataSourceStore((state) => state.getAuthState);
  const browser = useRouter();
  const authData = [getAuthState()];

  // create variables list for binding
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

  const getEntityEditorValue = ({ selectedEntityId, entity }: BindType) => {
    const entityHandlers = {
      auth: () => `${entity}['${selectedEntityId}']`,
      components: () =>
        `${entity}[/* ${components?.list[selectedEntityId].description} */'${selectedEntityId}']`,
      browser: () => `${entity}['${selectedEntityId}']`,
      variables: () => {
        try {
          const parsed = JSON.parse(selectedEntityId);
          return `${entity}[/* ${variables?.list[parsed.id].name} */].${
            parsed.path
          }`;
        } catch {
          return `${entity}[/* ${variables?.list[selectedEntityId].name} */]`;
        }
      },
    };

    return setSelectedItem(entityHandlers[entity]());
  };

  const getSelectedVariable = (id: string) =>
    variablesList.find((varItem) => varItem.id === id)?.defaultValue ?? id;

  const getSelectedVariableName = (id: string) =>
    variablesList.find((varItem) => varItem.id === id)?.name ?? id;

  const bindingPopoverProps = {
    variables,
    components,
    browserList,
    selectedItem,
    getSelectedVariable,
    getSelectedVariableName,
    variablesList,
    authData,
    bindableContexts: [components, authData[0]],
    getEntityEditorValue,
  };

  return bindingPopoverProps;
};
