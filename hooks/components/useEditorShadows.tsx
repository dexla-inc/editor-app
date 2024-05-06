import { useDroppable } from "@/hooks/editor/useDroppable";
import { useOnDrop } from "@/hooks/editor/useOnDrop";
import { ComponentToBind, useEditorStore } from "@/stores/editor";
import {
  GREEN_BASE_SHADOW,
  GREEN_COLOR,
  ORANGE_BASE_SHADOW,
  THIN_GREEN_BASE_SHADOW,
  THIN_ORANGE_BASE_SHADOW,
} from "@/utils/branding";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { useMemo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = {
  componentId: string;
  isSelected?: boolean;
  selectedByOther?: string;
};

export const useEditorShadows = ({
  componentId,
  isSelected,
  selectedByOther,
}: Props) => {
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  const isEditorMode = useEditorTreeStore(
    (state) => !isPreviewMode && !state.isLive,
  );
  const isPicking = useEditorStore(
    (state) =>
      state.pickingComponentToBindFrom || state.pickingComponentToBindTo,
  );
  const isOver = useEditorStore(
    (state) => state.currentTargetId === componentId,
  );
  const onDrop = useOnDrop();

  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const baseShadow = isPicking
    ? ORANGE_BASE_SHADOW
    : selectedByOther
    ? `inset 0 0 0 2px ${selectedByOther}`
    : GREEN_BASE_SHADOW;
  const thinBaseShadow = isPicking
    ? THIN_ORANGE_BASE_SHADOW
    : THIN_GREEN_BASE_SHADOW;
  const { edge, ...droppable } = useDroppable({
    id: componentId,
    onDrop,
    currentWindow: iframeWindow,
  });

  const shadows = useMemo(() => {
    if (isOver) {
      let boxShadow;
      switch (edge) {
        case "top":
          boxShadow = `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${
            selectedByOther ?? GREEN_COLOR
          }, ${baseShadow}`;
          break;
        case "bottom":
          boxShadow = `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${
            selectedByOther ?? GREEN_COLOR
          }, ${baseShadow}`;
          break;
        case "left":
          boxShadow = `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${
            selectedByOther ?? GREEN_COLOR
          }, ${baseShadow}`;
          break;
        case "right":
          boxShadow = `${DROP_INDICATOR_WIDTH}px 0 0 0 ${
            selectedByOther ?? GREEN_COLOR
          }, ${baseShadow}`;
          break;
        default:
          boxShadow = baseShadow;
      }
      return {
        boxShadow: boxShadow,
        background: edge === "center" ? selectedByOther ?? GREEN_COLOR : "none",
        opacity: edge === "center" ? 0.4 : 1,
      };
    } else if (isSelected || selectedByOther) {
      return { boxShadow: baseShadow };
    } else {
      return {};
    }
  }, [isOver, edge, selectedByOther, baseShadow, isSelected]);

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
        boxShadow: thinBaseShadow,
      },
    }),
    [thinBaseShadow, shadows],
  );

  if (!isEditorMode) {
    return {
      isPicking: {} as ComponentToBind,
      droppable: {},
      tealOutline: {},
    };
  }

  return {
    isPicking,
    droppable,
    tealOutline,
  };
};
