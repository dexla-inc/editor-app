import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment, useRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { useComputeCurrentState } from "@/hooks/components/useComputeCurrentState";
import { useComponentContextEventHandler } from "@/hooks/components/useComponentContextMenu";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { usePropsWithOverwrites } from "@/hooks/components/usePropsWithOverwrites";
import { useComputeChildStyles } from "@/hooks/components/useComputeChildStyles";
import { WithComponentWrapperProps } from "@/types/component";
import merge from "lodash.merge";
import { withDnd } from "@/hoc/withDnd";

export const withComponentWrapper = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = ({
    id,
    component: componentTree,
    renderTree,
    shareableContent,
    ...extraProps
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

    const childStyles = useComputeChildStyles({
      component: { ...component, id: componentTree.id },
      propsWithOverwrites,
    });

    const dndProps = merge({ draggable: true }, extraProps, childStyles);
    console.log("dndProps-->", dndProps);

    const props = {
      component: {
        ...component,
        ...componentTree,
        props: propsWithOverwrites,
        onLoad: computedOnLoad ?? {},
      },
      ...dndProps,
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
                zIndex: 1000,
                ...(tooltip &&
                  tooltip.length > 30 && { multiline: true, width: 220 }),
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

  return withDnd(ComponentWrapper);
};
