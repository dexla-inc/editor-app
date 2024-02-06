import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { IDENTIFIER } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { forwardRef } from "react";
import { useEndpoint } from "@/hooks/useEndpoint";

type Props = {
  renderTree: (component: Component, shareableContent: any) => any;
  component: Component;
  shareableContent?: any;
} & FlexProps;

export const ContainerComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
    const isLive = useEditorStore((state) => state.isLive);

    const { children, bg, triggers, loading, dataType, ...componentProps } =
      component.props as any;

    const { endpointId } = component.onLoad ?? {};

    const hasBorder =
      componentProps?.style?.borderWidth ||
      componentProps?.style?.borderTopWidth ||
      componentProps?.style?.borderBottomWidth ||
      componentProps?.style?.borderLeftWidth ||
      componentProps?.style?.borderRightWidth;
    const shouldRemoveBorder = isLive || isPreviewMode || hasBorder;

    const { data } = useEndpoint({
      component,
      forceEnabled: !!endpointId,
    });

    return (
      <MantineFlex
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={{
          width: "100%",
          ...props.style,
          ...(shouldRemoveBorder ? {} : { border: IDENTIFIER }),
        }}
        bg={bg}
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />
        {endpointId &&
          Array.isArray(data) &&
          data.map((item: any, repeatedIndex: number) => {
            return component.children && component.children.length > 0
              ? component.children?.map((child) =>
                  renderTree(
                    {
                      ...child,
                      props: {
                        ...child.props,
                        repeatedIndex,
                      },
                    },
                    {
                      ...props.shareableContent,
                      parentDataComponentId: component.id,
                      data: item,
                    },
                  ),
                )
              : children;
          })}
        {endpointId &&
          typeof data === "object" &&
          component.children?.map((child) =>
            renderTree(
              {
                ...child,
              },
              {
                ...props.shareableContent,
                parentDataComponentId: component.id,
                data,
              },
            ),
          )}
        {!endpointId && component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(
                {
                  ...child,
                  props: { ...child.props },
                },
                props.shareableContent,
              ),
            )
          : children}
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = withComponentWrapper<Props>(ContainerComponent);
