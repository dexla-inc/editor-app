import { useEditorTreeStore } from "@/stores/editorTree";
import { Node, useNodes } from "reactflow";
import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { safeJsonParse } from "@/utils/common";
import merge from "lodash.merge";
import { Action, APICallAction } from "@/utils/actions";
import { useDataSourceEndpoints } from "@/hooks/editor/reactQuery/useDataSourceEndpoints";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { useRouter } from "next/router";
import { useDataSourceStore } from "@/stores/datasource";
import { pick } from "next/dist/lib/pick";
import { useInputsStore } from "@/stores/inputs";
import { Component } from "@/utils/editor";
import { useShallow } from "zustand/react/shallow";
import { ContextType } from "@/types/dataBinding";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useShareableContent } from "@/hooks/data/useShareableContent";
import { relatedKeys } from "@/utils/data";
import cloneDeep from "lodash.clonedeep";

type BindType = {
  selectedEntityId: string;
  entity: ContextType;
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

const setEntityString = ({ selectedEntityId, entity }: BindType) => {
  const [entityKey, entityId] = selectedEntityId.split(".");
  const path = !entityId ? "" : `.${entityId}`;
  return `${entity}['${entityKey}']${path}`;
};

export const useBindingPopover = ({ isPageAction }: Props) => {
  const activePage = useEditorStore((state) => state.activePage);
  const selectedComponentActions = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return state.componentMutableAttrs[selectedComponentId!]?.actions;
  });
  const nodes = useNodes<NodeData>();
  const projectId = useEditorTreeStore((state) => state.currentProjectId ?? "");
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const { data: pageListQuery } = usePageListQuery(projectId, null);
  const pageActions = pageListQuery?.results?.find(
    (p) => p.id === activePage?.id,
  )?.actions;
  const relatedComponentsData = useShareableContent({ endpoints: endpoints! });
  const variablesList = useVariableStore((state) => state.variableList);
  const browser = useRouter();
  const auth = useDataSourceStore((state) => state.getAuthState());
  const inputsStore = useInputsStore((state) => state.inputValues);
  const selectedComponentId = useEditorTreeStore(selectedComponentIdSelector);
  const allInputComponents = useEditorTreeStore(
    useShallow((state) =>
      Object.values(state.componentMutableAttrs).reduce((acc, c) => {
        const isInput = [
          "Input",
          "Select",
          "Checkbox",
          "CheckboxGroup",
          "Radio",
          "Switch",
          "Textarea",
          "Autocomplete",
          "DateInput",
        ].includes(c?.name!);
        if (isInput) {
          acc.push({ id: c.id, name: c.name, description: c.description });
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
      const parsedValue =
        ["ARRAY", "OBJECT"].includes(variable.type) && typeof value === "string"
          ? parseVariableValue(value)
          : value;

      acc.list[variable.id] = variable;
      acc[variable.id] = parsedValue;
      acc[variable.name] = parsedValue;
      return acc;
    },
    { list: {} } as any,
  );

  const browserList = Array.of(
    pick(browser, ["asPath", "basePath", "pathname", "query", "route"]),
  );

  const actionsList = isPageAction ? pageActions : selectedComponentActions;

  const isLogicFlow = nodes.length > 0;

  function isNodeData(item: any): item is Node<NodeData> {
    return item.data !== undefined;
  }

  function isActionData(item: any): item is Action {
    return item.action !== undefined;
  }

  const actionsProcess = isLogicFlow ? nodes : actionsList;

  const actions = actionsProcess?.reduce(
    (acc, item) => {
      let actionId, actionName, actionType;
      let endpointId = "";

      if (isNodeData(item)) {
        const { action, endpoint } = item.data.form ?? {};
        actionId = item.id;
        endpointId = endpoint;
        actionName = item.data.label;
        actionType = item.type === "actionNode" && action;
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

  const actionsResponse = useEditorStore((state) => state.actionsResponse);

  if (actionsResponse) {
    Object.keys(actionsResponse).forEach((actionId) => {
      if (actions?.list[actionId]) {
        actions.list[actionId] = {
          ...actions.list[actionId],
          ...actionsResponse[actionId],
        };
      }
      if (actions && actions[actionId]) {
        actions[actionId] = {
          ...(actions?.[actionId] ?? {}),
          ...(actionsResponse?.[actionId] ?? {}),
        };
      }
    });
  }

  const selectedComponentValue = inputsStore[selectedComponentId!];

  const event = [
    {
      target: {
        checked: selectedComponentValue,
        value: null,
      },
    },
  ];

  const relatedComponentsDataList = Object.entries(relatedComponentsData);
  const itemData = relatedComponentsDataList?.at(-1);

  const item = cloneDeep(relatedComponentsDataList)
    ?.reverse()
    .reduce(
      (acc, [key, value], i) => {
        acc[relatedKeys[i]] = value;
        return acc;
      },
      {
        index: itemData?.[0]?.split("__")?.[1],
      } as any,
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
      event: () => setEntityString({ selectedEntityId, entity }),
      item: () => setEntityString({ selectedEntityId, entity }),
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
    auth,
    browserList,
    components,
    variables,
    event,
    getEntityEditorValue,
    item,
  };
};
