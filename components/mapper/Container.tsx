import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { setComponentBorder } from "@/utils/branding";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component, shareableContent: any) => any;
  component: Component;
  isPreviewMode?: boolean;
  shareableContent?: any;
} & FlexProps;

export const ContainerComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref) => {
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

    const { data } = useEndpoint({
      component,
      forceEnabled: !!endpointId,
    });

    const defaultBorder = setComponentBorder(props.style, isPreviewMode);
    const customStyle = merge({ width: "100%" }, props.style, {
      gap: gapPx,
      ...defaultBorder,
    });

    return (
      <MantineFlex
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={customStyle}
        bg={bg}
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />
        {endpointId &&
          Array.isArray(data) &&
          data.map((item: any, parentIndex: number) => {
            return component.children && component.children.length > 0
              ? component.children?.map((child) =>
                  renderTree(
                    {
                      ...child,
                      props: {
                        ...child.props,
                      },
                    },
                    {
                      ...props.shareableContent,
                      data: item,
                      parentIndex,
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
