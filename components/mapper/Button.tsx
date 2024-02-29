import { Icon } from "@/components/Icon";
import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useEditorStore } from "@/stores/editor";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent: any;
} & ButtonProps &
  ReactElement<"Button">;

const ButtonComponent = forwardRef(
  (
    {
      renderTree,
      component,
      isPreviewMode,
      style,
      shareableContent,
      ...props
    }: Props,
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

    const theme = useEditorStore((state) => state.theme);

    const contentEditableProps = useContentEditable(component.id as string);

    const { computeValue } = useDataContext()!;
    const childrenValue =
      computeValue({
        value: component.onLoad?.children,
        shareableContent,
        staticFallback: component.props?.children,
      }) ?? component.props?.children;

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
        ref={ref ?? contentEditableProps.ref}
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
