import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper, ActionTrigger } from "@/utils/actions";
import { DROP_INDICATOR_WIDTH } from "@/utils/config";
import { Component } from "@/utils/editor";
import { BoxProps, useMantineTheme } from "@mantine/core";
import merge from "lodash.merge";
import { Router, useRouter } from "next/router";
import { cloneElement, PropsWithChildren, useEffect } from "react";

type Props = {
  id: string;
  component: Component;
  customComponentModal?: any;
  isSelected?: boolean;
} & BoxProps;

const nonDefaultActionTriggers = ["onMount", "onSuccess", "onError"];

export const DroppableDraggable = ({
  id,
  children,
  component,
  isSelected,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isLive = useEditorStore((state) => state.isLive);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const isResizing = useEditorStore((state) => state.isResizing);
  const onMountActionsRan = useEditorStore((state) => state.onMountActionsRan);
  const addOnMountActionsRan = useEditorStore(
    (state) => state.addOnMountActionsRan,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom,
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates,
  );
  const language = useEditorStore((state) => state.language);
  const highlightedComponentId = useEditorStore(
    (state) => state.highlightedComponentId,
  );
  const { forceDestroyContextMenu } = useComponentContextMenu();

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
  const borderColor = isPicking ? "orange" : "teal";
  const baseShadow = `0 0 0 2px ${theme.colors[borderColor][6]}`;

  const shadows = isHighlighted
    ? { boxShadow: `0 0 0 2px ${theme.colors.orange[6]}` }
    : isOver
    ? {
        boxShadow:
          edge === "top"
            ? `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "bottom"
            ? `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "left"
            ? `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : baseShadow,
        background: edge === "center" ? theme.colors.teal[6] : "none",
        opacity: edge === "center" ? 0.4 : 1,
      }
    : isSelected
    ? { boxShadow: baseShadow }
    : {};

  const currentState =
    currentTreeComponentsStates?.[component.id!] ?? "default";
  const hoverStateFunc = () => {
    if (currentState === "default") {
      setTreeComponentCurrentState(component.id!, "hover");
    }
  };
  const leaveHoverStateFunc = () => {
    if (currentState === "hover") {
      setTreeComponentCurrentState(component.id!, "default");
    }
  };

  const propsWithOverwrites = merge(
    {},
    component.props,
    component.languages?.[language],
    component.states?.[currentState],
  );

  const isColumn = component.name === "GridColumn";
  const isGrid = component.name === "Grid";

  const isWidthPercentage = propsWithOverwrites?.style?.width?.endsWith("%");
  const isHeightPercentage = propsWithOverwrites?.style?.height?.endsWith("%");
  merge(propsWithOverwrites, {
    style: {
      // setting the inner div width/height. If percentage, the inner div size is 100% and the actual size is propagated
      // up to the parent element (the green border div)
      width: isWidthPercentage ? "100%" : propsWithOverwrites?.style?.width,
      height: isHeightPercentage ? "100%" : propsWithOverwrites?.style?.height,
      position: "relative",
      ...(!isColumn && !isGrid
        ? {
            alignSelf: "start" /* Aligns the item to the start of the column */,
            justifySelf: "start" /* Aligns the item to the start of the row */,
          }
        : {}),
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
      : {},
  });

  const showShadows = !isPreviewMode && !isLive && !isResizing;

  const childStyles = {
    ...propsWithOverwrites.style,
    ...(showShadows ? shadows : {}),
  };

  delete propsWithOverwrites.style;

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
          onClick: (e: any) => {
            if (!isPreviewMode) {
              e.stopPropagation();
              // @ts-ignore
              propsWithOverwrites.onClick?.(e);
              forceDestroyContextMenu();

              if (isPicking) {
                setComponentToBind(id);
              } else {
                setSelectedComponentId(id);
              }
            }
          },
        },
      )}
    </>
  );
};
