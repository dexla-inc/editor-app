import { useAppStore } from "@/stores/app";
import { Action, BaseAction } from "@/utils/actions";
import { Component, EditorTree } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";

export function useLoadingState(): {
  startLoading: (loading: any) => void;
  stopLoading: (loading: any) => void;
} {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  return {
    startLoading,
    stopLoading,
  };
}

export const handleLoadingStart = ({
  startLoading,
}: {
  startLoading: (loading: any) => void;
}) => {
  startLoading({
    id: "saving-action",
    title: "Saving Action",
    message: "Wait while we save your changes",
  });
};

export const handleLoadingStop = ({
  stopLoading,
  success = true,
}: { stopLoading: (loading: any) => void } & {
  success?: boolean;
}) => {
  stopLoading({
    id: "saving-action",
    title: success ? "Action Saved" : "Failed",
    message: success
      ? "Your changes were saved successfully"
      : "Oops, something went wrong while saving your changes",
    isError: !success,
  });
};

type UseSharedActionDataProps = {
  actionId: string;
  editorTree: EditorTree;
  selectedComponentId: string | undefined;
};

type SharedActionData<T extends BaseAction> = {
  componentActions: Action[];
  action: Action & { action: T };
};

export function useActionData<T extends BaseAction>({
  actionId,
  editorTree,
  selectedComponentId,
}: UseSharedActionDataProps): SharedActionData<T> {
  const component =
    useEditorStore.getState().componentMutableAttrs[selectedComponentId!];
  const componentActions = component?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.id === actionId,
  )!;

  return {
    componentActions,
    action: {
      ...action,
      // @ts-ignore
      action: action?.action as T,
    },
  };
}

type UpdateActionProps<T extends BaseAction> = {
  id: string;
  selectedComponentId: string;
  componentActions: Action[];
  updateTreeComponentAttrs: (params: {
    componentIds: string[];
    attrs: Partial<Component>;
    forceState?: string;
    save?: boolean;
  }) => void;
  updateValues: Omit<T, "name">;
};

export const updateActionInTree = <T extends BaseAction>({
  id,
  selectedComponentId,
  componentActions,
  updateTreeComponentAttrs,
  updateValues,
}: UpdateActionProps<T>) => {
  updateTreeComponentAttrs({
    componentIds: [selectedComponentId],
    attrs: {
      actions: componentActions.map((action: Action) => {
        if (action.id === id) {
          return {
            ...action,
            action: {
              ...action.action,
              ...updateValues,
            },
          };
        }
        return action;
      }),
    },
  });
};
