import { useDataContext } from "@/contexts/DataProvider";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";
import { useMemo } from "react";

export const useComputeCurrentState = (component: Component): string => {
  const { computeValue } = useDataContext()!;
  const isLive = useEditorTreeStore((state) => state.isLive);
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  console.log({ isPreviewMode });
  const isEditorMode = useEditorTreeStore(
    (state) => !state.isPreviewMode && !isLive,
  );
  const editorComponentState = useEditorTreeStore(
    (state) => state.currentTreeComponentsStates?.[component.id!] ?? "default",
  );

  return useMemo(() => {
    const boundState = computeValue({
      value: component.onLoad?.currentState,
      staticFallback: "default",
    });
    console.log({ isEditorMode, boundState });
    return isEditorMode ? editorComponentState : boundState;
  }, [component, computeValue, isEditorMode, editorComponentState]);
};
