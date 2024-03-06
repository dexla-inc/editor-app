import { useDataContext } from "@/contexts/DataProvider";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { useMemo } from "react";

export const useComputeCurrentState = (component: Component) => {
  const { computeValue } = useDataContext()!;
  const isEditorMode = useEditorStore((state) => !state.isPreviewMode);
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates,
  );

  return useMemo(() => {
    const computeCurrentState = (
      componentStates: Record<string, any>,
      component: Component,
      computeValue: any,
    ) => {
      const boundState = computeValue({
        value: component.onLoad?.currentState,
        staticFallback: "default",
      });

      const state = componentStates[component.id!];

      const isHovered = boundState === "default" && state === "hover";

      return isEditorMode || isHovered ? state ?? "default" : boundState;
    };

    return computeCurrentState(
      currentTreeComponentsStates ?? {},
      component,
      computeValue,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, computeValue, isEditorMode]);
};
