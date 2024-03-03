import { getCardStyling } from "@/components/CardStyleSelector";
import { CardAndContainerWrapper } from "@/components/mapper/CardAndContainerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { FlexProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent?: any;
} & FlexProps;

export const CardComponent = forwardRef(
  ({ renderTree, isPreviewMode, component, ...props }: Props, ref) => {
    const theme = useEditorStore((state) => state.theme);

    const cardStylingProps = getCardStyling(
      theme.cardStyle ?? "OUTLINED_ROUNDED",
      theme.colors["Border"][6],
      theme.defaultRadius,
    );

    const customStyle = merge(props.style, cardStylingProps);

    return (
      <CardAndContainerWrapper
        ref={ref}
        renderTree={renderTree}
        component={component}
        {...props}
        style={customStyle}
        shareableContent={props.shareableContent}
      />
    );
  },
);
CardComponent.displayName = "Card";

export const Card = withComponentWrapper<Props>(CardComponent);
