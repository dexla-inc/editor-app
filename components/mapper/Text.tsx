import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useMemo } from "react";

type Props = EditableComponentMapper & TextProps;

const TextComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref: any) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );
    const {
      triggers,
      hideIfDataIsEmpty,
      variable,
      text,
      fontTag,
      ...componentProps
    } = component.props as any;
    const { children: childrenValue = component.props?.children } =
      component.onLoad;
    const { style, ...restProps } = props as any;

    const { textStyle } = useBrandingStyles({ tag: fontTag });
    const customStyle = useMemo(
      () => merge({}, style, textStyle),
      [style, textStyle],
    );

    return (
      <MantineText
        key={props.id}
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref}
        style={customStyle}
      >
        {!hideIfDataIsEmpty && String(childrenValue)}
      </MantineText>
    );
  },
);

TextComponent.displayName = "Text";

export const Text = memo(withComponentWrapper<Props>(TextComponent));
