import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { IDENTIFIER } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";
import { useEndpoint } from "@/hooks/useEndpoint";
import get from "lodash.get";

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

    const { endpointId, resultsKey, binds, staleTime } = component.onLoad ?? {};

    const hasBorder =
      componentProps?.style?.borderWidth ||
      componentProps?.style?.borderTopWidth ||
      componentProps?.style?.borderBottomWidth ||
      componentProps?.style?.borderLeftWidth ||
      componentProps?.style?.borderRightWidth;
    const shouldRemoveBorder = isLive || isPreviewMode || hasBorder;

    const [data, setData] = useState(component.props?.data ?? []);

    const { data: response } = useEndpoint({
      endpointId,
      requestSettings: { binds, dataType, staleTime },
    });

    useEffect(() => {
      if (endpointId) {
        if (!response) {
          setData([]);
        } else {
          const result = get(response, resultsKey, response);
          setData(result);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultsKey, response, endpointId]);

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
          data?.map((item: any, repeatedIndex: number) => {
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
