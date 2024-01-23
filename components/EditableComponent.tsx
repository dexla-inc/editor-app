import {
  useComponentContextEventHandler,
  useComponentContextMenu,
} from "@/hooks/useComponentContextMenu";
import { useEditorShadows } from "@/hooks/useEditorShadows";
import { useHoverEvents } from "@/hooks/useHoverEvents";
import {
  computeChildStyles,
  handleBackground,
  useEditorClickHandler,
  usePropsWithOverwrites,
} from "@/hooks/useMergedProps";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { PropsWithChildren, cloneElement, useEffect } from "react";

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
  const currentState = useEditorStore(
    (state) => state.currentTreeComponentsStates?.[component.id!] ?? "default",
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const isResizing = useEditorStore((state) => state.isResizing);

  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const isLive = useEditorStore((state) => state.isLive);
  const isEditorMode = !isPreviewMode && !isLive;

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const handleContextMenu = useComponentContextEventHandler(
    component,
    componentContextMenu,
  );

  const triggers = useTriggers({
    component,
    isEditorMode,
    updateTreeComponent,
  });

  const { overlayStyles, handleMouseEnter, handleMouseLeave } =
    useHoverEvents();

  const { isPicking, droppable, tealOutline } = useEditorShadows({
    componentId: id,
    isSelected,
    selectedByOther,
    overlayStyles,
  });

  const propsWithOverwrites = usePropsWithOverwrites(
    component,
    isEditorMode,
    currentState,
    triggers,
    handleMouseEnter,
    handleMouseLeave,
  );

  const childStyles = computeChildStyles(
    propsWithOverwrites,
    currentState,
    isEditorMode,
  );

  handleBackground(component, childStyles);

  delete propsWithOverwrites.style;

  const handleClick = useEditorClickHandler(
    id,
    isEditorMode,
    forceDestroyContextMenu,
    propsWithOverwrites,
    isPicking,
  );

  // Could this be encapsulated in its own file?
  useEffect(() => {
    if (
      component.parentDataComponentId !== shareableContent.parentDataComponentId
    ) {
      updateTreeComponentAttrs([component.id!], {
        parentDataComponentId: shareableContent.parentDataComponentId,
      });
    }
  }, [shareableContent.parentDataComponentId]);

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
          isPreviewMode: isPreviewMode,
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
