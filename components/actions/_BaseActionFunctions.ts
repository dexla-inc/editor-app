import { useEditorTreeStore } from "@/stores/editorTree";
import { Action, BaseAction } from "@/utils/actions";
import { isRestrictedComponent } from "@/utils/common";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";

type SharedActionData<T extends BaseAction> = {
  componentActions: Action[];
};

export function useActionData<T extends BaseAction>(): SharedActionData<T> {
  const componentActions = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return state.componentMutableAttrs[selectedComponentId!].actions ?? [];
  });

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

export const updateActionInTree = async <T extends BaseAction>({
  id,
  selectedComponentId,
  componentActions,
  updatedValues,
}: UpdateActionProps<T>) => {
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;

  if (isRestrictedComponent(selectedComponentId)) {
    return;
  }

  await updateTreeComponentAttrs({
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
