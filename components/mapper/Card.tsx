import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { forwardRef } from "react";
import { getCardStyling } from "../CardStyleSelector";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & FlexProps;

export const CardComponent = forwardRef(
  ({ renderTree, isPreviewMode, component, ...props }: Props, ref) => {
    const theme = useEditorStore((state) => state.theme);

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

    const cardStylingProps = getCardStyling(
      theme.cardStyle ?? "OUTLINED_ROUNDED",
      theme.colors["Border"][6],
      theme.defaultRadius,
    );

    const customStyle = merge(props.style, cardStylingProps);

    return (
      <MantineFlex
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={{ ...customStyle }}
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
CardComponent.displayName = "Card";

export const Card = withComponentWrapper<Props>(CardComponent);
