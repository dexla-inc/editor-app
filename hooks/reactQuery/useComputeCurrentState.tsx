import { useEditorTreeStore } from "@/stores/editorTree";
import { useMemo } from "react";

// It decides which state to use based on the current mode
// If editorMode, it should use the state in currentTreeComponentsStates, this way we can preview the component states while editing
// If previewMode, parentState has more priority than currentState
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

  return useMemo(() => {
    return isEditorMode ? editorComponentState : parentState ?? currentState;
  }, [isEditorMode, editorComponentState, parentState, currentState]);
};
