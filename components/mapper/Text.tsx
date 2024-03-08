import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & TextProps;

const TextComponent = forwardRef(
  (
    { component, isPreviewMode, shareableContent, ...props }: Props,
    ref: any,
  ) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );
    const {
      triggers,
      hideIfDataIsEmpty,
      variable,
      text,

      ...componentProps
    } = component.props as any;
    const { style, ...restProps } = props as any;

    const { textStyle } = useBrandingStyles();
    const customStyle = merge({}, textStyle, style);

    const { computeValue } = useDataContext()!;

    const childrenValue =
      computeValue({
        value: component.onLoad?.children,
        shareableContent,
      }) ?? component.props?.children;

    return (
      <MantineText
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref}
        style={customStyle}
      >
        {!hideIfDataIsEmpty && childrenValue}
      </MantineText>
    );
  },
);
TextComponent.displayName = "Text";

export const Text = memo(withComponentWrapper<Props>(TextComponent), isSame);
