import { useEditorTreeStore } from "@/stores/editorTree";
import { useMemo } from "react";

export const useComputeCurrentState = (
  componentId: string,
  computedOnLoad: any,
  parentState: string,
): string => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const { currentState, previousState } = computedOnLoad;
  const previousStateDef = useEditorTreeStore(
    (state) => state.componentMutableAttrs[componentId]?.onLoad?.previousState,
  );

  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !state.isLive,
  );

  // this works like leaveHoverStateFunc, if the previousState dynamically changed and is other than default or hover,
  // then we need to revert the state to be the one before hovering
  if (
    currentState === "hover" &&
    previousState &&
    previousState !== "default" &&
    previousState !== "hover"
  ) {
    updateTreeComponentAttrs({
      componentIds: [componentId],
      attrs: {
        onLoad: {
          currentState: previousStateDef,
        },
      },
    });
  }

  const editorComponentState = useEditorTreeStore(
    (state) => state.currentTreeComponentsStates?.[componentId] ?? "default",
  );

  return useMemo(() => {
    return isEditorMode ? editorComponentState : parentState ?? currentState;
  }, [isEditorMode, editorComponentState, parentState, currentState]);
};
