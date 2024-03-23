import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";
import { useMemo } from "react";
import { useDataBinding } from "@/hooks/dataBinding/useDataBinding";

export const useComputeCurrentState = (component: Component): string => {
  const { computeValue } = useDataBinding();
  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !state.isLive,
  );
  const editorComponentState = useEditorTreeStore(
    (state) => state.currentTreeComponentsStates?.[component.id!] ?? "default",
  );

  return useMemo(() => {
    const boundState = computeValue({
      value: component.onLoad?.currentState,
      staticFallback: "default",
    });

    return isEditorMode ? editorComponentState : boundState;
  }, [component, computeValue, isEditorMode, editorComponentState]);
};
