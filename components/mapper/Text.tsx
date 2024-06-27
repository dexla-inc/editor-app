import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useMemo } from "react";
import useFontFaceObserver from "use-font-face-observer";

type Props = EditableComponentMapper & TextProps;

const TextComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref: any) => {
    const isFontLoaded = useFontFaceObserver([
      { family: "Poppins" }, // Same name you have in your CSS
    ]);

    console.log({ isFontLoaded });
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
        {!hideIfDataIsEmpty && isFontLoaded && String(childrenValue)}
      </MantineText>
    );
  },
);

TextComponent.displayName = "Text";

export const Text = memo(withComponentWrapper<Props>(TextComponent));
