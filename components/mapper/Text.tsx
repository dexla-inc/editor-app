import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import { Text as MantineText, TextProps, useMantineTheme } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useMemo } from "react";
import useFontFaceObserver from "use-font-face-observer";
import { isEmpty } from "@/utils/common";

type Props = EditableComponentMapper & TextProps;

const TextComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref: any) => {
    const theme = useMantineTheme();
    const isFontLoaded = useFontFaceObserver([{ family: theme.fontFamily! }]);
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

    const childrenValue = isEmpty(component.onLoad)
      ? component.props?.children
      : component.onLoad.children;

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
        sx={customStyle}
      >
        {!hideIfDataIsEmpty && isFontLoaded && String(childrenValue)}
      </MantineText>
    );
  },
);

TextComponent.displayName = "Text";

export const Text = memo(withComponentWrapper<Props>(TextComponent));
