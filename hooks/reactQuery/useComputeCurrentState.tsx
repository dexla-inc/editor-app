import { useEditorTreeStore } from "@/stores/editorTree";

export const useComputeCurrentState = (
  componentId: string,
  currentState: string,
  parentState: string,
): string => {
  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !state.isLive,
  );
  const editorComponentState = useEditorTreeStore(
    (state) => state.currentTreeComponentsStates?.[componentId] ?? "default",
  );

  // if parentState is defined overwrite component state
  if (parentState) {
    return parentState;
  }

  return isEditorMode ? editorComponentState : currentState;
};
