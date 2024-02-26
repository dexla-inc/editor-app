import { Component } from "@/utils/editor";

export const computeCurrentState = (
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
