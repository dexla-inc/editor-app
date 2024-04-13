import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { CURSOR_COLORS } from "@/utils/config";
import { useComputeCurrentState } from "@/hooks/reactQuery/useComputeCurrentState";
import { useEditorStore } from "@/stores/editor";
import {
  useComponentContextEventHandler,
  useComponentContextMenu,
} from "@/hooks/useComponentContextMenu";
import { useTriggers } from "@/hooks/useTriggers";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useEditorShadows } from "@/hooks/useEditorShadows";
import { usePropsWithOverwrites } from "@/hooks/usePropsWithOverwrites";
import { useComputeChildStyles } from "@/hooks/useComputeChildStyles";
import { useEditorClickHandler } from "@/hooks/useEditorClickHandler";
import { ComponentToolbox } from "@/components/ComponentToolbox";
import { WithComponentWrapperProps } from "@/types/component";
import { Component } from "@/utils/editor";

export const withComponentWrapper = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = ({
    component: componentTree,
    renderTree,
    shareableContent,
  }: WithComponentWrapperProps) => {
    const isEditorMode = useEditorTreeStore(
      useShallow((state) => !state.isPreviewMode && !state.isLive),
    );

    const isSelected = useEditorTreeStore(
      useShallow(
        (state) => state.selectedComponentIds?.includes(componentTree.id!),
      ),
    );

    const onLoad = useEditorTreeStore(
      useShallow(
        (state) => state.componentMutableAttrs[componentTree?.id!]?.onLoad,
      ),
    );

    const computedOnLoad = useComputeValue({ onLoad, shareableContent });

    // Commenting out as liveblocks doesn't work properly since detachment.
    // const selectedByOther = useEditorTreeStore(
    //   useShallow((state) => {
    //     const other = state.liveblocks?.others?.find(({ presence }: any) => {
    //       return presence.selectedComponentIds?.includes(componentTree.id);
    //     });

    //     if (!other) return null;

    //     return CURSOR_COLORS[other.connectionId % CURSOR_COLORS.length];
    //   }),
    // )!;

    const component = useEditorTreeStore(
      useShallow(
        (state) => state.componentMutableAttrs[componentTree.id!] ?? {},
      ),
    );

    //console.log("withComponentWrapper", component.description);

    const hasTooltip = !!component?.props?.tooltip;
    const initiallyLoading = component?.props?.initiallyLoading;
    const Wrapper = hasTooltip
      ? Tooltip
      : initiallyLoading
      ? Skeleton
      : Fragment;

    const currentState = useComputeCurrentState(
      componentTree.id!,
      computedOnLoad?.currentState,
      shareableContent?.parentState,
    );

    const isResizing = useEditorStore((state) => state.isResizing);

    const { componentContextMenu, forceDestroyContextMenu } =
      useComponentContextMenu();

    const handleContextMenu = useComponentContextEventHandler(
      { ...{}, ...componentTree, ...component },
      componentContextMenu,
    );

    const triggers = useTriggers({
      entity: component,
    });

    const { isPicking, droppable, tealOutline } = useEditorShadows({
      componentId: componentTree.id!,
      isSelected: false,
      //selectedByOther,
    });

    const propsWithOverwrites = usePropsWithOverwrites(
      component,
      isEditorMode,
      currentState,
      triggers,
    );

    const childStyles = useComputeChildStyles({
      component,
      propsWithOverwrites,
      currentState,
      isEditorMode,
    });

    const handleClick = useEditorClickHandler(
      componentTree.id!,
      isEditorMode,
      forceDestroyContextMenu,
      propsWithOverwrites,
      isPicking,
    );

    const { isVisible = true } = computedOnLoad;
    if (!isVisible) return null;

    const componentToolboxProps = {
      id: component.id,
      name: component.name,
      description: component.description,
      fixedPosition: component.fixedPosition,
    } as Component;

    const props = {
      component: {
        ...component,
        ...componentTree,
        props: propsWithOverwrites,
        onLoad: computedOnLoad ?? {},
      },
      renderTree,
      ...(isResizing || !isEditorMode ? {} : droppable),
      id: component.id,
      style: childStyles,
      sx: tealOutline,
      ...(isEditorMode && {
        onClick: handleClick,
        onContextMenu: handleContextMenu,
      }),
      shareableContent,
    } as any;

    return (
      <>
        {/* @ts-ignore */}
        <Wrapper
          {...(hasTooltip
            ? {
                label: component?.props?.tooltip,
                color: component?.props?.tooltipColor,
                position: component?.props?.tooltipPosition,
                withArrow: true,
              }
            : initiallyLoading
            ? { visible: true }
            : {})}
        >
          <Component {...props} />
        </Wrapper>
        {isSelected && isEditorMode && !shareableContent?.parentIndex && (
          <ComponentToolbox component={componentToolboxProps} />
        )}
      </>
    );
  };

  return ComponentWrapper;
};
