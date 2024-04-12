import { GRAY_OUTLINE } from "@/utils/branding";
import { CSSObject } from "@mantine/core";
import { handleBackground } from "@/hooks/handleBackground";
import { Component } from "@/utils/editor";

type UseComputeChildStylesProps = {
  component: Component;
  propsWithOverwrites: any;
  currentState: any;
  isEditorMode: boolean;
};

export const useComputeChildStyles = ({
  component,
  propsWithOverwrites,
  currentState,
  isEditorMode,
}: UseComputeChildStylesProps): CSSObject => {
  const childStyles: CSSObject = {
    position: "relative",
    ...propsWithOverwrites.style,
    ...(currentState === "hidden" && { display: "none" }),
    ...(currentState === "disabled" &&
      !isEditorMode && { pointerEvents: "none" }),

    outline:
      !isEditorMode && propsWithOverwrites.style?.outline === GRAY_OUTLINE
        ? "none"
        : propsWithOverwrites.style?.outline,
  };

  delete propsWithOverwrites.style;

  handleBackground(component, childStyles);

  return childStyles;
};
