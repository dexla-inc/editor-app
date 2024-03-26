import { getCardStyling } from "@/components/CardStyleSelector";
import { CardAndContainerWrapper } from "@/components/mapper/CardAndContainerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
type Props = EditableComponentMapper & FlexProps;

export const CardComponent = forwardRef(
  (
    { renderTree, shareableContent, isPreviewMode, component, ...props }: Props,
    ref,
  ) => {
    const theme = useThemeStore((state) => state.theme);

    const cardStylingProps = getCardStyling(
      theme.cardStyle ?? "OUTLINED_ROUNDED",
      theme.colors["Border"][6],
      theme.defaultRadius,
    );

    const customStyle = merge({}, cardStylingProps, props.style);

    return (
      <CardAndContainerWrapper
        ref={ref}
        renderTree={renderTree}
        component={component}
        {...props}
        style={customStyle}
        shareableContent={shareableContent}
      />
    );
  },
);
CardComponent.displayName = "Card";

export const Card = memo(withComponentWrapper<Props>(CardComponent), isSame);
