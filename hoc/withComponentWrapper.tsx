import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment, useRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { useComputeCurrentState } from "@/hooks/components/useComputeCurrentState";
import { useEditorStore } from "@/stores/editor";
import { useComponentContextEventHandler } from "@/hooks/components/useComponentContextMenu";
import { useTriggers } from "@/hooks/components/useTriggers";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { useEditorShadows } from "@/hooks/components/useEditorShadows";
import { usePropsWithOverwrites } from "@/hooks/components/usePropsWithOverwrites";
import { useComputeChildStyles } from "@/hooks/components/useComputeChildStyles";
import { useEditorClickHandler } from "@/hooks/components/useEditorClickHandler";
import { ComponentToolbox } from "@/components/ComponentToolbox";
import { WithComponentWrapperProps } from "@/types/component";
import { Component } from "@/utils/editor";
import { useRouter } from "next/navigation";
import merge from "lodash.merge";
import { withComponentVisibility } from "@/hoc/withComponentVisibility";

export const withComponentWrapper = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = ({
    id,
    component: componentTree,
    renderTree,
    shareableContent,
  }: WithComponentWrapperProps) => {
    const isEditorMode = useEditorTreeStore(
      (state) => !state.isPreviewMode && !state.isLive,
    );

    const isSelected = useEditorTreeStore(
      useShallow((state) => state.selectedComponentIds?.includes(id!)),
    );

    const component = useEditorTreeStore(
      useShallow(
        (state) => state.componentMutableAttrs[componentTree.id!] ?? {},
      ),
    );

    const computedOnLoad = useComputeValue({
      onLoad: component?.onLoad ?? {},
      shareableContent,
    });

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
    const tooltip = component?.props?.tooltip ?? computedOnLoad?.tooltip;
    const hasTooltip = !!tooltip;
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

    const handleContextMenu = useComponentContextEventHandler(
      merge({}, componentTree, component),
    );

    const router = useRouter();

    const triggers = useTriggers({
      entity: { ...component, id },
      router,
      shareableContent,
    });

    const propsWithOverwrites = usePropsWithOverwrites(
      { ...component, id, onLoad: computedOnLoad },
      isEditorMode,
      currentState,
      triggers,
    );

    const { droppable, tealOutline } = useEditorShadows({
      componentId: componentTree.id!,
    });

    const childStyles = useComputeChildStyles({
      component,
      propsWithOverwrites,
      isEditorMode,
    });

    const handleClick = useEditorClickHandler(id!);

    const componentToolboxProps = {
      id,
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
      id,
      style: childStyles,
      sx: tealOutline,
      ...(isEditorMode && {
        onClick: handleClick,
        onContextMenu: handleContextMenu,
      }),
      shareableContent,
    } as any;

    const ref = useRef(null);

    return (
      <>
        {/* @ts-ignore */}
        <Wrapper
          {...(hasTooltip
            ? {
                label: tooltip,
                color: component?.props?.tooltipColor,
                position: component?.props?.tooltipPosition,
                withArrow: true,
              }
            : initiallyLoading
              ? { visible: true }
              : {})}
        >
          <Component ref={ref} {...props} />
        </Wrapper>
        {isSelected && isEditorMode && component.description !== "Body" && (
          <ComponentToolbox component={componentToolboxProps} />
        )}
      </>
    );
  };

  return withComponentVisibility(ComponentWrapper);
};
