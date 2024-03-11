import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, BaseAction } from "@/utils/actions";

type SharedActionData<T extends BaseAction> = {
  componentActions: Action[];
};

export function useActionData<T extends BaseAction>(): SharedActionData<T> {
  const componentActions = useEditorTreeStore(
    (state) =>
      state.componentMutableAttrs[state.selectedComponentIds?.at(-1)!]
        .actions ?? [],
  );

  return {
    componentActions,
  };
}

type UpdateActionProps<T extends BaseAction> = {
  id: string;
  selectedComponentId: string;
  componentActions: Action[];
  updatedValues: Omit<T, "name">;
};

export const updateActionInTree = <T extends BaseAction>({
  id,
  selectedComponentId,
  componentActions,
  updatedValues,
}: UpdateActionProps<T>) => {
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;

  updateTreeComponentAttrs({
    componentIds: [selectedComponentId],
    attrs: {
      actions: componentActions.map((action: Action) => {
        if (action.id === id) {
          return {
            ...action,
            action: {
              ...action.action,
              ...updatedValues,
            },
          };
        }
        return action;
      }),
    },
  });
};
