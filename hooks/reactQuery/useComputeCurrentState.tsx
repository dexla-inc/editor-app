import { useDataContext } from "@/contexts/DataProvider";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";

const computeCurrentState = (
  componentStates: Record<string, any>,
  component: Component,
  isEditorMode: boolean,
  computeValue: any,
) => {
  const boundState = computeValue({
    value: component.onLoad?.currentState,
    staticFallback: "default",
  });
  const componentId = component.id;
  const state = componentStates?.[componentId!];

  const isHovered = boundState === "default" && state === "hover";

  return isEditorMode || isHovered ? state ?? "default" : boundState;
};

export const useComputeCurrentState = (
  component: Component,
  isEditorMode: boolean,
) => {
  const { computeValue } = useDataContext()!;
  return useEditorStore((state) =>
    computeCurrentState(
      state.currentTreeComponentsStates ?? {},
      component,
      isEditorMode,
      computeValue,
    ),
  );
};
