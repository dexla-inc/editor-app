import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
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
  const { children, triggers, leftIcon, ...componentProps } =
    component.props as any;

  const defaultTriggers = isPreviewMode
    ? {}
    : {
        onClick: (e: any) => {
          e.preventDefault();
        },
      };

  return (
    <MantineButton
      {...(leftIcon && { leftIcon: <Icon name={leftIcon} /> })}
      {...defaultTriggers}
      {...props}
      {...componentProps}
      {...triggers}
    >
      {component.children && Array.isArray(component.children)
        ? component.children.map((child) => renderTree(child))
        : children}
    </MantineButton>
  );
};

export const Button = memo(ButtonComponent, isSame);
