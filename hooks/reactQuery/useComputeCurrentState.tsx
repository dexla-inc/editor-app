import { useEditorTreeStore } from "@/stores/editorTree";

export const useComputeCurrentState = (
  componentId: string,
  currentState: string,
): string => {
  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !state.isLive,
  );
  const editorComponentState = useEditorTreeStore(
    (state) => state.currentTreeComponentsStates?.[componentId] ?? "default",
  );

  return isEditorMode ? editorComponentState : currentState;
};
