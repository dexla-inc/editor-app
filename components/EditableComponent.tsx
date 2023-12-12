import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useDroppable } from "@/hooks/useDroppable";
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
import { BoxProps } from "@mantine/core";
import merge from "lodash.merge";
import { Router, useRouter } from "next/router";
import React, {
  cloneElement,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

type Props = {
  id: string;
  component: Component;
  isSelected?: boolean;
} & BoxProps;

const nonDefaultActionTriggers = ["onMount", "onSuccess", "onError"];

export const EditableComponent = ({
  id,
  children,
  component,
  isSelected,
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
  const onMountActionsRan = useEditorStore((state) => state.onMountActionsRan);
  const addOnMountActionsRan = useEditorStore(
    (state) => state.addOnMountActionsRan,
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

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const actions: Action[] = component.actions ?? [];
  const onMountAction: Action | undefined = actions.find(
    (action: Action) => action.trigger === "onMount",
  );

  const onSuccessActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onSuccess",
  );

  const onErrorActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onError",
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

  useEffect(() => {
    if (
      onMountAction &&
      isPreviewMode &&
      !onMountActionsRan.includes(onMountAction.id)
    ) {
      addOnMountActionsRan(onMountAction.id);
      actionMapper[onMountAction.action.name].action({
        // @ts-ignore
        action: onMountAction.action,
        actionId: onMountAction.id,
        router: router as Router,
        onSuccess: onSuccessActions.find(
          (sa) => sa.sequentialTo === onMountAction.id,
        ),
        onError: onErrorActions.find(
          (ea) => ea.sequentialTo === onMountAction.id,
        ),
        component,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreviewMode, onMountAction, onMountActionsRan]);

  const onDrop = useOnDrop();

  const { edge, ...droppable } = useDroppable({
    id,
    onDrop,
    currentWindow: iframeWindow,
  });

  const isPicking = pickingComponentToBindFrom || pickingComponentToBindTo;
  const isOver = currentTargetId === id;
  const isHighlighted = highlightedComponentId === id;
  const baseShadow = isPicking ? ORANGE_BASE_SHADOW : GREEN_BASE_SHADOW;
  const thinBaseShadow = isPicking
    ? THIN_ORANGE_BASE_SHADOW
    : THIN_GREEN_BASE_SHADOW;

  const shadows = isHighlighted
    ? { boxShadow: ORANGE_BASE_SHADOW }
    : isOver
    ? {
        boxShadow:
          edge === "top"
            ? `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${GREEN_COLOR}, ${baseShadow}`
            : edge === "bottom"
            ? `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${GREEN_COLOR}, ${baseShadow}`
            : edge === "left"
            ? `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${GREEN_COLOR}, ${baseShadow}`
            : edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px 0 0 0 ${GREEN_COLOR}, ${baseShadow}`
            : baseShadow,
        background: edge === "center" ? GREEN_COLOR : "none",
        opacity: edge === "center" ? 0.4 : 1,
      }
    : isSelected
    ? { boxShadow: baseShadow }
    : {};

  const hoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "default") {
      setTreeComponentCurrentState(e.currentTarget.id, "hover");
    }
  };
  const leaveHoverStateFunc = (e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "hover") {
      setTreeComponentCurrentState(e.currentTarget.id, "default");
    }
  };

  const propsWithOverwrites = merge(
    {},
    component.props,
    component.languages?.[language],
    component.states?.[currentState],
  );

  const isWidthPercentage = propsWithOverwrites?.style?.width?.endsWith("%");
  const isHeightPercentage = propsWithOverwrites?.style?.height?.endsWith("%");

  // State hooks for overlays
  const [overlayStyles, setOverlayStyles] = useState({
    display: "none", // By default, the overlays are not displayed
    position: {},
    padding: {},
    margin: {},
    content: {},
  });

  const hoveredComponentId = useEditorStore(
    (state) => state.hoveredComponentId,
  );
  const setHoveredComponentId = useEditorStore(
    (state) => state.setHoveredComponentId,
  );

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
        border: "2px dashed purple", // Padding overlay color
      },
      margin: {
        marginTop: computedStyle.marginTop,
        marginRight: computedStyle.marginRight,
        marginBottom: computedStyle.marginBottom,
        marginLeft: computedStyle.marginLeft,
        margin: computedStyle.margin,
        border: "2px dashed purple", // Padding overlay color
      },
      content: {
        width: `calc(100% - ${computedStyle.paddingLeft} - ${computedStyle.paddingRight})`,
        height: `calc(100% - ${computedStyle.paddingTop} - ${computedStyle.paddingBottom})`,
        backgroundColor: "rgba(173, 216, 230, 0.5)", // Content overlay color
      },
    });
  };

  // Event handlers for mouse enter and leave
  const handleMouseEnter = (e: any, id?: string) => {
    e.stopPropagation();
    const newHoveredId = e.currentTarget.id;
    setHoveredComponentId(newHoveredId);
    const element = (iframeWindow ?? window).document.getElementById(
      id ?? newHoveredId,
    );
    updateOverlays(element);
  };

  const handleMouseLeave = (e: any) => {
    e.stopPropagation(); // Stop the event from bubbling up to prevent child's onMouseLeave affecting parent
    // Set a timeout to clear the hovered state
    setTimeout(() => {
      if (hoveredComponentId === e.currentTarget?.id) {
        setHoveredComponentId("");
        // ... Hide overlays
        setOverlayStyles((prevStyles) => ({ ...prevStyles, display: "none" }));
      }
    }, 10);
  };

  const shouldDisplayOverlay = hoveredComponentId === id;

  merge(propsWithOverwrites, {
    style: {
      // setting the inner div width/height. If percentage, the inner div size is 100% and the actual size is propagated
      // up to the parent element (the green border div)
      width: isWidthPercentage ? "100%" : propsWithOverwrites?.style?.width,
      height: isHeightPercentage ? "100%" : propsWithOverwrites?.style?.height,
      position: component.props?.style?.position ?? "relative",
    },
    disabled:
      component.props?.disabled ??
      (currentState === "disabled" && !!component.states?.disabled),
    triggers: isPreviewMode
      ? {
          ...triggers,
          onMouseEnter: triggers?.onHover ?? hoverStateFunc,
          onMouseLeave: leaveHoverStateFunc,
        }
      : {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        },
  });

  const showShadows = !isPreviewMode && !isLive;

  const childStyles = {
    ...propsWithOverwrites.style,
    ...(showShadows ? shadows : {}),

    outline:
      isPreviewMode && propsWithOverwrites.style?.outline === GRAY_OUTLINE
        ? "none"
        : propsWithOverwrites.style?.outline,
  };

  delete propsWithOverwrites.style;

  const handleClick = useCallback(
    (e: any) => {
      if (!isPreviewMode) {
        e.stopPropagation();

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
      }
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
          ...(isResizing ? {} : droppable),
          id: component.id,
          isPreviewMode,
          style: childStyles,
          sx: {
            "&:hover": {
              ...(!isPreviewMode
                ? {
                    boxShadow: thinBaseShadow,
                    ...(shouldDisplayOverlay && hoverStyles(overlayStyles)),
                  }
                : {}),
            },
          },
          onClick: handleClick,
          ...(isPreviewMode
            ? {}
            : {
                onContextMenu: componentContextMenu(component),
              }),
        },
      )}
    </>
  );
};
