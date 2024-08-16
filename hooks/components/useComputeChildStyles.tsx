import { handleBackground } from "@/hooks/components/handleBackground";
import { useEditorStore } from "@/stores/editor";
import {
  componentHasBorder,
  GRAY_COLOR,
  GRAY_OUTLINE,
  GRAY_WHITE_COLOR,
  GREEN_BASE_SHADOW,
  GREEN_COLOR,
  THIN_GREEN_BASE_SHADOW,
} from "@/utils/branding";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { Component } from "@/utils/editor";
import { CSSObject, Sx } from "@mantine/core";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

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
      pointerEvents: "none",
      "& > *": {
        pointerEvents: "auto",
      },
      "&:hover": {
        pointerEvents: "auto",
        boxShadow: THIN_GREEN_BASE_SHADOW,
        "& > *": {
          pointerEvents: "none",
        },
        "&::after": {
          content: `"${component.name}"`,
          position: "absolute",
          top: "0px",
          left: "0",
          background: "transparent",
          color: GREEN_COLOR,
          padding: "2px 4px",
          fontSize: "12px",
          borderRadius: "2px",
          zIndex: 10000,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          transform: "translateY(-100%)",
        },
      },
    }),
    [shadows],
  );

  const {
    outline = "none",
    outlineOffset = "0px",
    ...otherStyles
  } = propsWithOverwrites.style || {};
  const childStyles: CSSObject = {
    position: "relative",
    ...otherStyles,
  };

  delete propsWithOverwrites.style;

  handleBackground(component, childStyles);
  const hasBorder = componentHasBorder(childStyles);

  return {
    style: childStyles,
    sx: {
      ".editor-mode &": {
        ...tealOutline,
        ...(!hasBorder && { outline, outlineOffset }),
      },
      ".preview-mode &": {
        ...(propsWithOverwrites.disabled && { pointerEvents: "none" }),
        outline: outline === GRAY_OUTLINE ? "none" : outline,
      },
    },
  };
};
