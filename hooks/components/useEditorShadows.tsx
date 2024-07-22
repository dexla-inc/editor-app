import { useDroppable } from "@/hooks/editor/useDroppable";
import { useOnDrop } from "@/hooks/editor/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import {
  GREEN_BASE_SHADOW,
  GREEN_COLOR,
  THIN_GREEN_BASE_SHADOW,
} from "@/utils/branding";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  componentId: string;
};

export const useEditorShadows = ({ componentId }: Props) => {
  const shadows = useEditorStore(
    useShallow((state) => {
      const baseShadow = GREEN_BASE_SHADOW;
      const edge =
        state.currentTargetId === componentId ? state.edge : undefined;

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

  const onDrop = useOnDrop();
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const droppable = useDroppable({
    id: componentId,
    onDrop,
    currentWindow: iframeWindow,
  });

  const tealOutline = useMemo(
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

  return {
    droppable,
    tealOutline,
  };
};
