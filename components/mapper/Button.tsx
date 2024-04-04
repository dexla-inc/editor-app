import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useThemeStore } from "@/stores/theme";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo } from "react";

type Props = EditableComponentMapper & ButtonProps & ReactElement<"Button">;

const ButtonComponent = forwardRef(
  (
    { component, isPreviewMode, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    const {
      triggers,
      icon,
      iconPosition,
      loading,
      textColor,
      variable,
      color,
      ...componentProps
    } = component.props as any;

    const theme = useThemeStore((state) => state.theme);

    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const childrenValue = useComputeValue({
      componentId: component.id!,
      field: "children",
      shareableContent,
      staticFallback: component.props?.children,
    });

    const defaultTriggers = isPreviewMode
      ? {}
      : {
          onClick: (e: any) => {
            e.preventDefault();
          },
        };

    const labelTextColor = getColorFromTheme(theme, textColor);

    const { buttonStyle } = useBrandingStyles();

    const { color: backgroundColor } = useChangeState({
      bg: textColor,
      textColor: color,
    });

    const customStyle = merge({}, buttonStyle, style, {
      color: labelTextColor,
      backgroundColor,
    });

    const { sx, ...restProps } = props;

    return (
      <MantineButton
        {...contentEditableProps}
        {...(icon &&
          iconPosition === "left" && { leftIcon: <Icon name={icon} /> })}
        {...(icon &&
          iconPosition === "right" && { rightIcon: <Icon name={icon} /> })}
        loading={loading}
        {...defaultTriggers}
        {...restProps}
        {...(!isPreviewMode ? { sx: { ...sx } } : {})}
        {...componentProps}
        {...triggers}
        style={customStyle}
        styles={{ root: DISABLED_HOVER }}
        ref={ref}
      >
        {childrenValue}
      </MantineButton>
    );
  },
);
ButtonComponent.displayName = "Button";

// export const Button = memo(ButtonComponent, isSame);
export const Button = memo(
  withComponentWrapper<Props>(ButtonComponent),
  isSame,
);
