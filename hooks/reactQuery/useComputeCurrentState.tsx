import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";

export const useComputeCurrentState = (component: Component): string => {
  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !state.isLive,
  );
  const editorComponentState = useEditorTreeStore(
    (state) => state.currentTreeComponentsStates?.[component.id!] ?? "default",
  );

  const { currentState } = useComputeValue2({
    onLoad: component.onLoad,
  });

  return isEditorMode ? editorComponentState : currentState;
};
