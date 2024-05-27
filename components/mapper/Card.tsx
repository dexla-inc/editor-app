import { getCardStyling } from "@/components/CardStyleSelector";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useRenderData } from "@/hooks/components/useRenderData";
import { convertSizeToPx } from "@/utils/defaultSizes";
type Props = EditableComponentMapper & FlexProps;

export const CardComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const theme = useThemeStore((state) => state.theme);

    const {
      dataType = "static",
      data,
      triggers,
      ...componentProps
    } = component?.props ?? {};

    const gapPx = convertSizeToPx(component?.props?.gap, "gap");
    const cardStylingProps = getCardStyling(
      theme.cardStyle ?? "OUTLINED_ROUNDED",
      theme.colors["Border"][6],
      theme.defaultRadius,
    );

    const customStyle = merge({}, cardStylingProps, props.style, {
      gap: gapPx,
    });

    const { renderData } = useRenderData({
      component,
      shareableContent,
    });

    return (
      <MantineFlex
        ref={ref}
        {...props}
        style={customStyle}
        {...triggers}
        {...componentProps}
      >
        {renderData({ renderTree })}
      </MantineFlex>
    );
  },
);
CardComponent.displayName = "Card";

export const Card = memo(withComponentWrapper<Props>(CardComponent));
