import { useEditorTreeStore } from "@/stores/editorTree";
import { useMemo } from "react";

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
