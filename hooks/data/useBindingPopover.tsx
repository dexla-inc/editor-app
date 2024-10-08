import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useEventData } from "@/hooks/data/useEventData";
import { useOldRouter } from "@/hooks/data/useOldRouter";
import { useShareableContent } from "@/hooks/data/useShareableContent";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { ContextType } from "@/types/dataBinding";
import { Action, APICallAction } from "@/utils/actions";
import { safeJsonParse } from "@/utils/common";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { getAllComponentsByName } from "@/utils/editor";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { Node, useNodes } from "reactflow";
import { useShallow } from "zustand/react/shallow";
import { useEndpoints } from "../editor/reactQuery/useDataSourcesEndpoints";

type BindType = {
  selectedEntityId: string;
  entity: ContextType;
};
const inputComponentNames = [
  "Input",
  "Select",
  "CheckboxGroup",
  "Checkbox",
  "CheckboxItem",
  "Radio",
  "RadioItem",
  "Switch",
  "DateInput",
  "Textarea",
  "Autocomplete",
  "FileUpload",
  "FileButton",
  "Rating",
  "ColorPicker",
];

const setEntityString = ({ selectedEntityId, entity }: BindType) => {
  const [entityKey, ...entityId] = selectedEntityId.split(".");
  const path = !entityId.length ? "" : `.${entityId.join(".")}`;
  return `${entity}['${entityKey}']${path}`;
};

export const useBindingPopover = () => {
  const { isPageAction } = useBindingField();
  const activePage = useEditorStore((state) => state.activePage);
  const selectedComponentActions = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return state.componentMutableAttrs[selectedComponentId!]?.actions;
  });
  const nodes = useNodes<NodeData>();
  const projectId = useEditorTreeStore((state) => state.currentProjectId ?? "");
  const language = useEditorTreeStore((state) => state.language);
  const { endpoints } = useEndpoints(projectId);
  const { data: pageListQuery, invalidate } = usePageListQuery(projectId, null);
  const pageActions = pageListQuery?.results?.find(
    (p) => p.id === activePage?.id,
  )?.actions;
  const { computeValue } = useDataBinding();
  const { item } = useShareableContent({ computeValue });
  const variablesList = useVariableStore((state) =>
    Object.values(state.variableList),
  );
  const browser = useOldRouter();
  const getAuthState = useDataSourceStore((state) => state.getAuthState);
  const inputsStore = useInputsStore((state) => state.inputValues);
  const event = useEventData();

  useEffect(() => {
    invalidate();
  }, []);

  const components = useEditorTreeStore(
    useShallow((state) => {
      const allInputs = getAllComponentsByName(
        state.tree.root,
        inputComponentNames,
        // @ts-ignore
      ).sort((a, b) => a?.description?.localeCompare(b?.description));

      // reading all inputs from the tree
      const treeInputs = allInputs.reduce(
        (acc, comp) => {
          const { id = "", description } = comp ?? {};

          acc.list[id] = {
            id,
            name: description,
            description,
            value: inputsStore[id],
          };
          acc[id] = inputsStore[id];

          return acc;
        },
        { list: {} } as Record<string, any>,
      );

      // reading the inputStore, as this should be the source of truth
      return Object.entries(inputsStore).reduce(
        (acc, [componentGroupId, value]) => {
          const [componentId, groupId] = componentGroupId.split("-related-");
          const { description } =
            state.componentMutableAttrs[componentId] ?? {};

          // this line replaces fields that were supposed to be repeatable
          delete acc[componentId];
          delete acc.list[componentId];

          acc.list[componentGroupId] = {
            id: componentGroupId,
            name: description,
            description,
            value,
          };
          acc[componentGroupId] = value;

          return acc;
        },
        treeInputs,
      );
    }),
  );

  const variables = variablesList.reduce(
    (acc, variable) => {
      let value = variable.value ?? variable.defaultValue ?? "";
      const parsedValue =
        ["ARRAY", "OBJECT"].includes(variable.type) && typeof value === "string"
          ? safeJsonParse(value)
          : value;

      acc.list[variable.id] = variable;
      acc[variable.id] = parsedValue;
      acc[variable.name] = parsedValue;
      return acc;
    },
    { list: {} } as Record<string, any>,
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

  const actions = (actionsProcess ?? []).reduce(
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
    { list: {} } as Record<string, any>,
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
      others: () => setEntityString({ selectedEntityId, entity }),
    };

    return entityHandlers[entity]();
  };

  const others = {
    auth: getAuthState(projectId) ?? {},
    browser: pick(browser, ["asPath", "query"]),
    language,
  };

  return {
    actions,
    others,
    components,
    variables,
    event,
    getEntityEditorValue,
    item,
  };
};
