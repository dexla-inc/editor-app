import {
  GRAY_OUTLINE,
  GREEN_BASE_SHADOW,
  GREEN_COLOR,
  THIN_GREEN_BASE_SHADOW,
} from "@/utils/branding";
import { CSSObject, Sx } from "@mantine/core";
import { handleBackground } from "@/hooks/components/handleBackground";
import { Component } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";
import { useShallow } from "zustand/react/shallow";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { useMemo } from "react";

type UseComputeChildStylesProps = {
  component: Component;
  propsWithOverwrites: any;
};

export const useComputeChildStyles = ({
  component,
  propsWithOverwrites,
}: UseComputeChildStylesProps): CSSObject => {
  const shadows = useEditorStore(
    useShallow((state) => {
      const baseShadow = GREEN_BASE_SHADOW;
      const edge =
        state.currentTargetId === component.id ? state.edge : undefined;

      if (edge) {
        let boxShadow;
        switch (edge) {
          case "top":
            boxShadow = `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${
              GREEN_COLOR
            }, ${baseShadow}`;
            break;
          case "bottom":
            boxShadow = `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${
              GREEN_COLOR
            }, ${baseShadow}`;
            break;
          case "left":
            boxShadow = `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${
              GREEN_COLOR
            }, ${baseShadow}`;
            break;
          case "right":
            boxShadow = `${DROP_INDICATOR_WIDTH}px 0 0 0 ${
              GREEN_COLOR
            }, ${baseShadow}`;
            break;
          default:
            boxShadow = baseShadow;
        }
        return {
          boxShadow: boxShadow,
          background: edge === "center" ? GREEN_COLOR : "none",
          opacity: edge === "center" ? 0.4 : 1,
        };
      } else {
        return {};
      }
    }),
  );

  const tealOutline: Sx = useMemo(
    () => ({
      "&:before": {
        ...shadows,
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      },
      "&:hover": {
        boxShadow: THIN_GREEN_BASE_SHADOW,
      },
    }),
    [shadows],
  );

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
