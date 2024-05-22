import { useEditorTreeStore } from "@/stores/editorTree";
import { Node, useNodes } from "reactflow";
import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { safeJsonParse } from "@/utils/common";
import merge from "lodash.merge";
import { Action, APICallAction } from "@/utils/actions";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { useRouter } from "next/navigation";
import { useDataSourceStore } from "@/stores/datasource";
import { pick } from "next/dist/lib/pick";
import { useInputsStore } from "@/stores/inputs";
import { useShallow } from "zustand/react/shallow";
import { ContextType } from "@/types/dataBinding";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useShareableContent } from "@/hooks/data/useShareableContent";
import { useEventData } from "@/hooks/data/useEventData";
import { useEndpoints } from "../editor/reactQuery/useDataSourcesEndpoints";

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
  const { endpoints } = useEndpoints(projectId);
  const { data: pageListQuery } = usePageListQuery(projectId, null);
  const pageActions = pageListQuery?.results?.find(
    (p) => p.id === activePage?.id,
  )?.actions;
  const { item } = useShareableContent({});
  const variablesList = useVariableStore((state) =>
    Object.values(state.variableList),
  );
  const browser = useRouter();
  const getAuthState = useDataSourceStore((state) => state.getAuthState);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const event = useEventData();

  const components = useEditorTreeStore(
    useShallow((state) =>
      Object.entries(inputsStore).reduce(
        (acc, [componentGroupId, value]) => {
          const [componentId, groupId] = componentGroupId.split("-related-");
          const { description } =
            state.componentMutableAttrs[componentId] ?? {};

          acc.list[componentGroupId] = {
            id: componentGroupId,
            name: description,
            description,
            value,
          };
          acc[componentGroupId] = value;

          return acc;
        },
        { list: {} } as any,
      ),
    ),
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
        const endpoint = endpoints.find((e) => e.id === endpointId);

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

  const getEntityEditorValue = ({ selectedEntityId, entity }: BindType) => {
    const entityHandlers = {
      auth: () => setEntityString({ selectedEntityId, entity }),
      components: () => {
        try {
          const parsed = JSON.parse(selectedEntityId);
          return `${entity}[/* ${components?.list[parsed.id].description} */ '${
            parsed.id
          }']${parsed.path.replace("value", "")}`;
        } catch {
          return `${entity}[/* ${components?.list[selectedEntityId].description} */'${selectedEntityId}']`;
        }
      },
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
    auth: getAuthState(projectId),
    browserList,
    components,
    variables,
    event,
    getEntityEditorValue,
    item,
  };
};
