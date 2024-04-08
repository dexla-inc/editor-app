import { GRAY_OUTLINE } from "@/utils/branding";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";
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
  const computedStyle =
    useComputeValue2({ onLoad: propsWithOverwrites.style }) ?? {};

  delete propsWithOverwrites.style;

  const childStyles: CSSObject = {
    position: "relative",
    ...computedStyle,
    ...(currentState === "hidden" && { display: "none" }),
    ...(currentState === "disabled" &&
      !isEditorMode && { pointerEvents: "none" }),

    outline:
      !isEditorMode && computedStyle?.outline === GRAY_OUTLINE
        ? "none"
        : computedStyle?.outline,
  };

  handleBackground(component, childStyles);

  return childStyles;
};
