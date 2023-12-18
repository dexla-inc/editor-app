import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { IDENTIFIER } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import isEmpty from "lodash.isempty";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const ContainerComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
    const isLive = useEditorStore((state) => state.isLive);

    const {
      children,
      bg,
      triggers,
      data: dataProp,
      exampleData = {},
      dataPath,
      loading,
      ...componentProps
    } = component.props as any;

    const data = !isPreviewMode ? undefined : dataProp?.value ?? dataProp;
    const hasBorder =
      componentProps?.style?.borderWidth ||
      componentProps?.style?.borderTopWidth ||
      componentProps?.style?.borderBottomWidth ||
      componentProps?.style?.borderLeftWidth ||
      componentProps?.style?.borderRightWidth;
    const shouldRemoveBorder = isLive || isPreviewMode || hasBorder;

    if (loading) {
      return <MantineSkeleton height={300} />;
    }

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
        {data &&
          !isEmpty(data) &&
          data.length > 0 &&
          data.map((_: any, repeatedIndex: number) => {
            return component.children && component.children.length > 0
              ? component.children?.map((child) =>
                  renderTree({
                    ...child,
                    props: {
                      ...child.props,
                      repeatedIndex,
                    },
                  }),
                )
              : children;
          })}
        {(!data || isEmpty(data) || data.length === 0) &&
        component.children &&
        component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                props: { ...child.props },
              }),
            )
          : children}
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = withComponentWrapper<Props>(ContainerComponent);
