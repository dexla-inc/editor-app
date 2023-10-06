import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { ReactElement, memo } from "react";
import { useEditorStore } from "@/stores/editor";

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
    color,
    textColor,
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
      {...defaultTriggers}
      {...props}
      {...componentProps}
      {...triggers}
      style={{ backgroundColor, color: labelTextColor }}
    >
      {children}
    </MantineButton>
  );
};

export const Button = memo(ButtonComponent, isSame);
