import { GRAY_OUTLINE } from "@/utils/branding";
import { CSSObject, Sx } from "@mantine/core";
import { handleBackground } from "@/hooks/components/handleBackground";
import { Component } from "@/utils/editor";

type UseComputeChildStylesProps = {
  component: Component;
  propsWithOverwrites: any;
  tealOutline: Sx;
};

export const useComputeChildStyles = ({
  component,
  propsWithOverwrites,
  tealOutline,
}: UseComputeChildStylesProps): CSSObject => {
  const childStyles: CSSObject = {
    position: "relative",
    ...propsWithOverwrites.style,
  };

  delete propsWithOverwrites.style;

  handleBackground(component, childStyles);

  return {
    style: childStyles,
    sx: {
      ".editor-mode &": {
        ...tealOutline,
      },
      ".preview-mode &": {
        ...(propsWithOverwrites.disabled && { pointerEvents: "none" }),
        outline:
          propsWithOverwrites.style?.outline === GRAY_OUTLINE
            ? "none"
            : propsWithOverwrites.style?.outline,
      },
    },
  };
};
