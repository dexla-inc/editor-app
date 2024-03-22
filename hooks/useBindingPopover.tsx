import { useEditorTreeStore } from "@/stores/editorTree";
import { Node, useNodes } from "reactflow";
import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { safeJsonParse } from "@/utils/common";
import merge from "lodash.merge";
import { Action, APICallAction } from "@/utils/actions";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { useInputsStore } from "@/stores/inputs";
import { memoize } from "proxy-memoize";
import { Component } from "@/utils/editor";

type BindType = {
  selectedEntityId: string;
  entity: "auth" | "components" | "browser" | "variables" | "actions";
};

type Props = {
  isPageAction?: boolean;
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

const setEntityString = ({ selectedEntityId, entity }: BindType) => {
  const [entityKey, entityId] = selectedEntityId.split(".");
  const path = !entityId ? "" : `.${entityId}`;
  return `${entity}['${entityKey}']${path}`;
};

export const useBindingPopover = ({ isPageAction }: Props) => {
  const activePage = useEditorStore((state) => state.activePage);
  const selectedComponentActions = useEditorTreeStore(
    (state) =>
      state.componentMutableAttrs[state.selectedComponentIds?.at(-1)!]?.actions,
  );
  const nodes = useNodes<NodeData>();
  const projectId = useEditorTreeStore((state) => state.currentProjectId ?? "");
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const { data: pageListQuery } = usePageListQuery(projectId, null);
  const pageActions = pageListQuery?.results?.find(
    (p) => p.id === activePage?.id,
  )?.actions;
  const variablesList = useVariableStore((state) => state.variableList);
  const inputsStore = useInputsStore((state) => state.inputValues);

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

  const actionsList = isPageAction ? pageActions : selectedComponentActions;

  const isLogicFlow = nodes.length > 0;

  function isNodeData(item: any): item is Node<NodeData> {
    return item.data !== undefined;
  }

  function isActionData(item: any): item is Action {
    return item.action !== undefined;
  }

  const itemsToProcess = isLogicFlow ? nodes : actionsList;

  const actions = itemsToProcess?.reduce(
    (acc, item) => {
      let actionId, actionName, actionType;
      let endpointId = "";

      if (isNodeData(item)) {
        const { action, endpoint } = item.data.form ?? {};
        actionId = item.id;
        endpointId = endpoint;
        actionName = item.data.label;
        actionType = action;
      } else if (isActionData(item)) {
        const { endpoint } = item.action as APICallAction;
        actionId = item.id;
        endpointId = endpoint;
        actionName = item.action.name;
        actionType = item.action.name;
      }

      if (actionType === "apiCall" && endpointId) {
        const endpoint = endpoints?.results.find((e) => e.id === endpointId);

        const successExampleResponse = safeJsonParse(
          endpoint?.exampleResponse ?? "",
        );
        const errorExampleResponse = safeJsonParse(
          endpoint?.errorExampleResponse ?? "",
        );

        const success = successExampleResponse;
        const error = errorExampleResponse;

        acc.list[actionId!] = merge({}, endpoint, {
          id: actionId,
          name: actionName,
          success,
          error,
        });
        acc[actionId!] = {
          success,
          error,
        };
      }

      return acc;
    },
    { list: {} } as any,
  );

  const getEntityEditorValue = ({ selectedEntityId, entity }: BindType) => {
    const entityHandlers = {
      auth: () => setEntityString({ selectedEntityId, entity }),
      components: () =>
        `${entity}[/* ${components?.list[selectedEntityId].description} */'${selectedEntityId}']`,
      actions: () => {
        const parsed = JSON.parse(selectedEntityId);
        return `${entity}[/* ${actions?.list[parsed.id].name} */ '${
          parsed.id
        }'].${parsed.path}`;
      },
      browser: () => setEntityString({ selectedEntityId, entity }),
      variables: () => {
        try {
          const parsed = JSON.parse(selectedEntityId);
          return `${entity}[/* ${variables?.list[parsed.id].name} */ '${
            parsed.id
          }']${parsed.path.replace("value", "")}`;
        } catch {
          return `${entity}[/* ${variables?.list[selectedEntityId].name} */ '${selectedEntityId}']`;
        }
      },
    };

    return entityHandlers[entity]();
  };

  return {
    actions,
    getEntityEditorValue,
  };
};
