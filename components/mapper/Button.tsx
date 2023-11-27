import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { ReactElement, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & ButtonProps &
  ReactElement<"Button">;

const ButtonComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const {
    children,
    triggers,
    leftIcon,
    rightIcon,
    loading,
    textColor,
    color,
    style,
    ...componentProps
  } = component.props as any;

  const defaultTriggers = isPreviewMode
    ? {}
    : {
        onClick: (e: any) => {
          e.preventDefault();
        },
      };

  const labelTextColor = getColorFromTheme(theme, textColor);
  const backgroundColor = getColorFromTheme(theme, color);

  return (
    <MantineButton
      {...(leftIcon && { leftIcon: <Icon name={leftIcon} /> })}
      {...(rightIcon && { rightIcon: <Icon name={rightIcon} /> })}
      loading={loading}
      {...defaultTriggers}
      style={{
        ...style,
        backgroundColor,
        color: labelTextColor,
      }}
      {...props}
      {...componentProps}
      {...triggers}
    >
      {children}
    </MantineButton>
  );
};

export const Button = memo(ButtonComponent, isSame);
