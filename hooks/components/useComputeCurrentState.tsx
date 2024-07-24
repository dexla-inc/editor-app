import { useEditorTreeStore } from "@/stores/editorTree";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

// It decides which state to use based on the current mode
// If editorMode, it should use the state in currentTreeComponentsStates, this way we can preview the component states while editing
// If previewMode, parentState has more priority than currentState
export const useComputeCurrentState = (
  componentId: string,
  currentState: string,
  parentState: string,
): string => {
  const isEditorMode = true;

  const editorComponentState = useEditorTreeStore(
    useShallow(
      (state) => state.currentTreeComponentsStates?.[componentId] ?? "default",
    ),
  );

  // if parent state is set, we want it both in editor and preview mode
  return useMemo(() => {
    const computedState = isEditorMode ? editorComponentState : currentState;
    return parentState ?? computedState;
  }, [isEditorMode, editorComponentState, parentState, currentState]);
};
