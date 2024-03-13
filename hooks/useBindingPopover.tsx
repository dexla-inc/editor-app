import { useDataContext } from "@/contexts/DataProvider";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Node, useNodes } from "reactflow";
import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { safeJsonParse } from "@/utils/common";
import merge from "lodash.merge";
import { Action, APICallAction } from "@/utils/actions";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";

type BindType = {
  selectedEntityId: string;
  entity: "auth" | "components" | "browser" | "variables" | "actions";
};

const setEntityString = ({ selectedEntityId, entity }: BindType) => {
  const [entityKey, entityId] = selectedEntityId.split(".");
  const path = !entityId ? "" : `.${entityId}`;
  return `${entity}['${entityKey}']${path}`;
};

export const useBindingPopover = () => {
  const { variables, components } = useDataContext()!;

  const selectedComponentId = useEditorTreeStore(
    (state) => state.selectedComponentIds?.at(-1)!,
  );
  const componentMutableAttrs = useEditorTreeStore(
    (state) => state.componentMutableAttrs,
  );
  const selectedComponent = componentMutableAttrs[selectedComponentId];
  const nodes = useNodes<NodeData>();
  const projectId = useEditorTreeStore((state) => state.currentProjectId ?? "");
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  const actionsList = selectedComponent?.actions;
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
      let actionId, endpointId, actionName, actionType;

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
