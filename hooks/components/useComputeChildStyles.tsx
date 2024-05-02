import { GRAY_OUTLINE } from "@/utils/branding";
import { CSSObject } from "@mantine/core";
import { handleBackground } from "@/hooks/components/handleBackground";
import { Component } from "@/utils/editor";

type UseComputeChildStylesProps = {
  component: Component;
  propsWithOverwrites: any;
  isEditorMode: boolean;
};

export const useComputeChildStyles = ({
  component,
  propsWithOverwrites,
  isEditorMode,
}: UseComputeChildStylesProps): CSSObject => {
  const childStyles: CSSObject = {
    position: "relative",
    ...propsWithOverwrites.style,
    ...(propsWithOverwrites.disabled &&
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
