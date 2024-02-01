import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { getAllComponentsByName } from "@/utils/editor";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDataContext } from "@/contexts/DataProvider";

type BindType = {
  selectedEntityId: string;
  entity: "auth" | "components" | "browser" | "variables";
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

export const useBindingPopover = () => {
  const variablesList = useVariableStore((state) => state.variableList);

  const { variables, components } = useDataContext();

  const getEntityEditorValue = ({ selectedEntityId, entity }: BindType) => {
    const entityHandlers = {
      auth: () => `${entity}['${selectedEntityId}']`,
      components: () =>
        `${entity}[/* ${components?.list[selectedEntityId].description} */'${selectedEntityId}']`,
      browser: () => `${entity}['${selectedEntityId}']`,
      variables: () => {
        try {
          const parsed = JSON.parse(selectedEntityId);
          return `${entity}[/* ${variables?.list[parsed.id].name} */ '${
            parsed.id
          }'].${parsed.path}`;
        } catch {
          return `${entity}[/* ${variables?.list[selectedEntityId].name} */ '${selectedEntityId}']`;
        }
      },
    };

    return entityHandlers[entity]();
  };

  const getSelectedVariable = (id: string) =>
    variablesList.find((varItem) => varItem.id === id)?.defaultValue ?? id;

  const getSelectedVariableName = (id: string) =>
    variablesList.find((varItem) => varItem.id === id)?.name ?? id;

  return {
    getSelectedVariable,
    getSelectedVariableName,
    getEntityEditorValue,
  };
};
