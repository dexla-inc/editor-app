import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import isEmpty from "lodash.isempty";
import { forwardRef } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const CardComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

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

    if (loading) {
      return <MantineSkeleton height={300} />;
    }

    return (
      <MantineFlex
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={{ width: "100%", ...props.style }}
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
                      ...componentProps,
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
                props: { ...child.props, ...componentProps },
              }),
            )
          : children}
      </MantineFlex>
    );
  },
);
CardComponent.displayName = "Card";

export const Card = withComponentWrapper(CardComponent);
