import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useDroppable } from "@/hooks/useDroppable";
import { useHoverState } from "@/hooks/useHoverState";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper, ActionTrigger } from "@/utils/actions";
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
import { Router, useRouter } from "next/router";
import {
  ChangeEvent,
  cloneElement,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";

type Props = {
  id: string;
  component: Component;
  isSelected?: boolean;
  selectedByOther?: string;
} & BoxProps;

const nonDefaultActionTriggers = ["onSuccess", "onError"];

export const EditableComponent = ({
  id,
  children,
  component,
  isSelected,
  selectedByOther,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
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
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const currentState = useEditorStore(
    (state) => state.currentTreeComponentsStates?.[component.id!] ?? "default",
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
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
    // Open the default context menu if the user is holding down a key
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    // Open our own context menu
    event.preventDefault();
    componentContextMenu(component)(event);
  };

  const actions: Action[] = component.actions ?? [];

  const onSuccessActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onSuccess",
  );

  const onErrorActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onError",
  );

  const hoveredComponentId = useEditorStore(
    (state) => state.hoveredComponentId,
  );
  const setHoveredComponentId = useEditorStore(
    (state) => state.setHoveredComponentId,
  );

  const triggers = actions.reduce(
    (acc, action: Action) => {
      if (nonDefaultActionTriggers.includes(action.trigger)) {
        return acc;
      }

      return {
        ...acc,
        [action.trigger]: (e: any) =>
          actionMapper[action.action.name].action({
            // @ts-ignore
            action: action.action,
            actionId: action.id,
            router: router as Router,
            event: e,
            onSuccess: onSuccessActions.find(
              (sa) => sa.sequentialTo === action.id,
            ),
            onError: onErrorActions.find((ea) => ea.sequentialTo === action.id),
            component,
          }),
      };
    },
    {} as Record<ActionTrigger, any>,
  );

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

  const shadows = isHighlighted
    ? { boxShadow: ORANGE_BASE_SHADOW }
    : isOver
    ? {
        boxShadow:
          edge === "top"
            ? `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${
                selectedByOther ?? GREEN_COLOR
              }, ${baseShadow}`
            : edge === "bottom"
            ? `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${
                selectedByOther ?? GREEN_COLOR
              }, ${baseShadow}`
            : edge === "left"
            ? `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${
                selectedByOther ?? GREEN_COLOR
              }, ${baseShadow}`
            : edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px 0 0 0 ${
                selectedByOther ?? GREEN_COLOR
              }, ${baseShadow}`
            : baseShadow,
        background: edge === "center" ? selectedByOther ?? GREEN_COLOR : "none",
        opacity: edge === "center" ? 0.4 : 1,
      }
    : isSelected || selectedByOther
    ? { boxShadow: baseShadow }
    : {};

  const handleBackground = (styles: CSSObject) => {
    const isGradient = component.props?.bg?.includes("gradient");
    const hasImage = !!styles.backgroundImage;

    if (isGradient && hasImage) {
      styles.backgroundImage = `${styles.backgroundImage}, ${component.props?.bg}`;
    }
  };

  // State hooks for overlays
  const [overlayStyles, setOverlayStyles] = useState({
    display: "none", // By default, the overlays are not displayed
    position: {},
    padding: {},
    margin: {},
  });

  // Function to update overlays based on the target element
  const updateOverlays = (element: any, display?: string) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    setOverlayStyles({
      display: display ?? "block", // Show the overlays
      position: {
        width: rect.width + "px",
        height: rect.height + "px",
        top: rect.top + "px",
        left: rect.left + "px",
      },
      padding: {
        paddingTop: computedStyle.paddingTop,
        paddingRight: computedStyle.paddingRight,
        paddingBottom: computedStyle.paddingBottom,
        paddingLeft: computedStyle.paddingLeft,
        padding: computedStyle.padding,
      },
      margin: {
        marginTop: computedStyle.marginTop,
        marginRight: computedStyle.marginRight,
        marginBottom: computedStyle.marginBottom,
        marginLeft: computedStyle.marginLeft,
        margin: computedStyle.margin,
      },
    });
  };

  const { handleMouseEnter, handleMouseLeave } = useHoverState(
    setHoveredComponentId,
    updateOverlays,
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

  const tealOutline = {
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
            ...(shouldDisplayOverlay &&
              !isSelected &&
              hoverStyles(overlayStyles)),
          }
        : {}),
    },
  };

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

      // @ts-ignore
      propsWithOverwrites.onClick?.(e);
      forceDestroyContextMenu();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      forceDestroyContextMenu,
      id,
      isPicking,
      isPreviewMode,
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
        },
      )}
    </>
  );
};
