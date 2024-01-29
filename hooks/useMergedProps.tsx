import { ComponentToBind, useEditorStore } from "@/stores/editor";
import { GRAY_OUTLINE } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { removeKeysRecursive } from "@/utils/removeKeys";
import { CSSObject } from "@mantine/core";
import merge from "lodash.merge";
import { useCallback, useMemo } from "react";
import { useComponentStates } from "./useComponentStates";

export const usePropsWithOverwrites = (
  component: Component,
  isEditorMode: boolean,
  currentState: any,
  triggers: any,
  handleMouseEnter: (e: any) => void,
  handleMouseLeave: (e: any) => void,
) => {
  const language = useEditorStore((state) => state.language);
  const { checkIfIsDisabledState, handleComponentIfDisabledState } =
    useComponentStates();

  const isDisabledState = checkIfIsDisabledState(component.name, currentState);
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );

  const hoverStateFunc = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (currentState === "default") {
      setTreeComponentCurrentState(e.currentTarget.id, "hover");
    }
  }, []);

  const leaveHoverStateFunc = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (currentState === "hover") {
        setTreeComponentCurrentState(e.currentTarget.id, "default");
      }
    },
    [],
  );

  return useMemo(() => {
    return merge(
      {},
      isEditorMode
        ? removeKeysRecursive(component.props ?? {}, ["error"])
        : component.props,
      component.languages?.[language],
      component.states?.[currentState],
      {
        disabled: isDisabledState,
        triggers: !isEditorMode
          ? {
              ...triggers,
              onMouseOver: triggers?.onHover ?? hoverStateFunc,
              onMouseLeave: leaveHoverStateFunc,
              ...(isDisabledState && {
                onKeyDown: handleComponentIfDisabledState,
              }),
            }
          : {
              onMouseOver: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
            },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, currentState, triggers]);
};

export function computeChildStyles(
  propsWithOverwrites: any,
  currentState: any,
  isEditorMode: boolean,
) {
  const childStyles = {
    position: "relative",
    ...propsWithOverwrites.style,
    ...(currentState === "hidden" && { display: "none" }),
    ...(currentState === "disabled" &&
      !isEditorMode && { pointerEvents: "none" }),

    outline:
      !isEditorMode && propsWithOverwrites.style?.outline === GRAY_OUTLINE
        ? "none"
        : propsWithOverwrites.style?.outline,
  };

  return childStyles;
}

export const useEditorClickHandler = (
  componentId: string,
  isEditorMode: boolean,
  forceDestroyContextMenu: any,
  propsWithOverwrites: any,
  isPicking?: ComponentToBind,
) => {
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  return useCallback(
    (e: any) => {
      if (isEditorMode) {
        e.stopPropagation && e.stopPropagation();
      }

      if (isPicking) {
        setComponentToBind(componentId);
      } else {
        setSelectedComponentId(componentId);
        if (e.ctrlKey || e.metaKey) {
          setSelectedComponentIds((prev) => {
            if (prev.includes(componentId)) {
              return prev.filter((p) => p !== componentId);
            }
            return [...prev, componentId];
          });
        } else {
          setSelectedComponentIds(() => [componentId]);
        }
      }

      propsWithOverwrites.onClick?.(e);
      forceDestroyContextMenu();
    },
    [
      isEditorMode,
      forceDestroyContextMenu,
      componentId,
      isPicking,
      propsWithOverwrites,
      setComponentToBind,
      setSelectedComponentId,
      setSelectedComponentIds,
    ],
  );
};

export const handleBackground = (component: Component, styles: CSSObject) => {
  const isGradient = component.props?.bg?.includes("gradient");
  const hasImage = !!styles.backgroundImage;

  if (isGradient && hasImage) {
    styles.backgroundImage = `${styles.backgroundImage}, ${component.props?.bg}`;
  }
};
