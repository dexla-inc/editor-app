import { useDataContext } from "@/contexts/DataProvider";
import { useAppMode } from "@/hooks/useAppMode";
import {
  useComponentContextEventHandler,
  useComponentContextMenu,
} from "@/hooks/useComponentContextMenu";
import { useEditorShadows } from "@/hooks/useEditorShadows";
import { useHoverEvents } from "@/hooks/useHoverEvents";
import {
  handleBackground,
  useComputeChildStyles,
  useEditorClickHandler,
  usePropsWithOverwrites,
} from "@/hooks/useMergedProps";
import { useTriggers } from "@/hooks/useTriggers";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { PropsWithChildren, cloneElement } from "react";

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
  const { computeValue } = useDataContext()!;
  const { isPreviewMode } = useAppMode();
  const isLive = useEditorStore((state) => state.isLive);
  const isEditorMode = !isPreviewMode && !isLive;

  const currentState = useEditorStore((state) =>
    isEditorMode
      ? state.currentTreeComponentsStates?.[component.id!] ?? "default"
      : computeValue({
          value: component.onLoad?.currentState,
          staticFallback: "default",
        }),
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const isResizing = useEditorStore((state) => state.isResizing);
  const { computeChildStyles } = useComputeChildStyles();

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const handleContextMenu = useComponentContextEventHandler(
    component,
    componentContextMenu,
  );

  const triggers = useTriggers({
    entity: component,
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
    shareableContent.parentIndex,
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
          ...(isResizing || !isEditorMode ? {} : droppable),
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
