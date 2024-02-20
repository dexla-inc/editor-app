import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useEditorStore } from "@/stores/editor";
import { IDENTIFIER } from "@/utils/branding";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component, shareableContent: any) => any;
  component: Component;
  isPreviewMode?: boolean;
  shareableContent?: any;
} & FlexProps;

export const ContainerComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref) => {
    const isLive = useEditorStore((state) => state.isLive);

    const {
      children,
      bg,
      triggers,
      loading,
      dataType,
      gap,
      ...componentProps
    } = component.props as any;

    const { endpointId } = component.onLoad ?? {};
    const gapPx = convertSizeToPx(gap, "gap");

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
          gap: gapPx,
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
