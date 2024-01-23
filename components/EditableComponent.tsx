import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useDroppable } from "@/hooks/useDroppable";
import { useHoverEvents } from "@/hooks/useHoverEvents";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import {
  GRAY_OUTLINE,
  GREEN_BASE_SHADOW,
  GREEN_COLOR,
  hoverStyles,
  ORANGE_BASE_SHADOW,
  THIN_GREEN_BASE_SHADOW,
  THIN_ORANGE_BASE_SHADOW,
} from "@/utils/branding";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { Component } from "@/utils/editor";
import { removeKeysRecursive } from "@/utils/removeKeys";
import { BoxProps, CSSObject } from "@mantine/core";
import merge from "lodash.merge";
import { ChangeEvent, cloneElement, PropsWithChildren, useCallback, useMemo, useEffect } from "react";

type Props = {
  id: string;
  component: Component;
  isSelected?: boolean;
  selectedByOther?: string;
  shareableContent?: any;
} & BoxProps;

export const EditableComponent = ({
  id,
  children,
  component,
  isSelected,
  selectedByOther,
  shareableContent,
}: PropsWithChildren<Props>) => {
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const currentState = useEditorStore(
    (state) => state.currentTreeComponentsStates?.[component.id!] ?? "default",
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isResizing = useEditorStore((state) => state.isResizing);
  const isLive = useEditorStore((state) => state.isLive);
  const language = useEditorStore((state) => state.language);
  const highlightedComponentId = useEditorStore(
    (state) => state.highlightedComponentId,
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom,
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo,
  );
  const isEditorMode = !isPreviewMode && !isLive;

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const handleContextMenu = (event: any) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    componentContextMenu(component)(event);
  };

  const hoveredComponentId = useEditorStore(
    (state) => state.hoveredComponentId,
  );
  const setHoveredComponentId = useEditorStore(
    (state) => state.setHoveredComponentId,
  );

  const triggers = useTriggers({
    component,
    isEditorMode,
    updateTreeComponent,
  });

  useEffect(() => {
    if (
      component.parentDataComponentId !== shareableContent.parentDataComponentId
    ) {
      updateTreeComponentAttrs([component.id!], {
        parentDataComponentId: shareableContent.parentDataComponentId,
      });
    }
  }, [shareableContent.parentDataComponentId]);

  const { onChange, onSubmit } = triggers;
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
    if (component.props?.error) {
      updateTreeComponent({
        componentId: id,
        props: { error: "" },
        save: false,
      });
    }
  };

  const handleOnSubmit = (e: any) => {
    isEditorMode && e.preventDefault();
    !isEditorMode && onSubmit && onSubmit(e);
  };

  triggers.onChange = handleOnChange;
  triggers.onSubmit = handleOnSubmit;

  const onDrop = useOnDrop();

  const { edge, ...droppable } = useDroppable({
    id,
    onDrop,
    currentWindow: iframeWindow,
  });

  const isPicking = pickingComponentToBindFrom || pickingComponentToBindTo;
  const isOver = currentTargetId === id;
  const isHighlighted = highlightedComponentId === id;
  const baseShadow = isPicking
    ? ORANGE_BASE_SHADOW
    : selectedByOther
    ? `inset 0 0 0 2px ${selectedByOther}`
    : GREEN_BASE_SHADOW;
  const thinBaseShadow = isPicking
    ? THIN_ORANGE_BASE_SHADOW
    : THIN_GREEN_BASE_SHADOW;
  const shouldDisplayOverlay = hoveredComponentId === id && isEditorMode;

  const shadows = useMemo(() => {
    if (isHighlighted) {
      return { boxShadow: ORANGE_BASE_SHADOW };
    } else if (isOver) {
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
  }, [isHighlighted, isOver, edge, selectedByOther, baseShadow, isSelected]);

  const handleBackground = (styles: CSSObject) => {
    const isGradient = component.props?.bg?.includes("gradient");
    const hasImage = !!styles.backgroundImage;

    if (isGradient && hasImage) {
      styles.backgroundImage = `${styles.backgroundImage}, ${component.props?.bg}`;
    }
  };

  const { overlayStyles, handleMouseEnter, handleMouseLeave } = useHoverEvents(
    setHoveredComponentId,
    hoveredComponentId,
    iframeWindow,
  );

  const propsWithOverwrites = merge(
    {},
    isEditorMode
      ? removeKeysRecursive(component.props ?? {}, ["error"])
      : component.props,
    component.languages?.[language],
    component.states?.[currentState],
    {
      triggers: !isEditorMode
        ? {
            ...triggers,
          }
        : {
            onMouseOver: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
          },
    },
  );

  const childStyles = {
    position: "relative",
    ...propsWithOverwrites.style,
    ...(currentState === "hidden" && { display: "none" }),
    ...(currentState === "disabled" &&
      !isEditorMode && { PointerEvent: "none" }),

    outline:
      !isEditorMode && propsWithOverwrites.style?.outline === GRAY_OUTLINE
        ? "none"
        : propsWithOverwrites.style?.outline,
  };

  handleBackground(childStyles);

  delete propsWithOverwrites.style;

  const tealOutline = useMemo(
    () => ({
      "&:before": {
        ...(isEditorMode ? shadows : {}),
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
        ...(isEditorMode
          ? {
              boxShadow: thinBaseShadow,
              ...(shouldDisplayOverlay && hoverStyles(overlayStyles)),
            }
          : {}),
      },
    }),
    [
      shouldDisplayOverlay,
      thinBaseShadow,
      isEditorMode,
      overlayStyles,
      shadows,
    ],
  );

  const handleClick = useCallback(
    (e: any) => {
      if (isEditorMode) {
        e.stopPropagation && e.stopPropagation();
      }

      if (isPicking) {
        setComponentToBind(id);
      } else {
        setSelectedComponentId(id);
        if (e.ctrlKey || e.metaKey) {
          setSelectedComponentIds((prev) => {
            if (prev.includes(id)) {
              return prev.filter((p) => p !== id);
            }
            return [...prev, id];
          });
        } else {
          setSelectedComponentIds(() => [id]);
        }
      }

      propsWithOverwrites.onClick?.(e);
      forceDestroyContextMenu();
    },
    [
      isEditorMode,
      forceDestroyContextMenu,
      id,
      isPicking,
      propsWithOverwrites,
      setComponentToBind,
      setSelectedComponentId,
      setSelectedComponentIds,
    ],
  );

  return (
    <>
      {cloneElement(
        // @ts-ignore
        children,
        {
          component: {
            ...component,
            props: propsWithOverwrites,
          },
          ...(isResizing || isPreviewMode ? {} : droppable),
          id: component.id,
          isPreviewMode: !isEditorMode,
          style: childStyles,
          sx: tealOutline,
          ...(isEditorMode && {
            onClick: handleClick,
            onContextMenu: handleContextMenu,
          }),
          shareableContent,
        },
      )}
    </>
  );
};
