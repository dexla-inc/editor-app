import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment, useRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { useComputeCurrentState } from "@/hooks/components/useComputeCurrentState";
import { useComponentContextEventHandler } from "@/hooks/components/useComponentContextMenu";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { useEditorDroppableEvents } from "@/hooks/components/useEditorDroppableEvents";
import { usePropsWithOverwrites } from "@/hooks/components/usePropsWithOverwrites";
import { useComputeChildStyles } from "@/hooks/components/useComputeChildStyles";
import { WithComponentWrapperProps } from "@/types/component";
import merge from "lodash.merge";
import { withComponentVisibility } from "@/hoc/withComponentVisibility";
import "./global.scss";

export const withComponentWrapper = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = ({
    id,
    component: componentTree,
    renderTree,
    shareableContent,
  }: WithComponentWrapperProps) => {
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

    const handleContextMenu = useComponentContextEventHandler(
      merge({}, componentTree, component),
    );

    const propsWithOverwrites = usePropsWithOverwrites(
      { ...component, id, onLoad: computedOnLoad },
      shareableContent,
      currentState,
    );

    const { droppable } = useEditorDroppableEvents({
      componentId: componentTree.id!,
    });

    const childStyles = useComputeChildStyles({
      component: { ...component, id: componentTree.id },
      propsWithOverwrites,
    });

    const props = {
      className: "test",
      component: {
        ...component,
        ...componentTree,
        props: propsWithOverwrites,
        onLoad: computedOnLoad ?? {},
      },
      ...droppable,
      ...childStyles,
      renderTree,
      id,
      onContextMenu: handleContextMenu,
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
      </>
    );
  };

  return withComponentVisibility(ComponentWrapper);
};
