import { Icon } from "@/components/Icon";
import { Component } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { ReactElement } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & ButtonProps &
  ReactElement<"Button">;

export const Button = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const { children, triggers, leftIcon, rightIcon, ...componentProps } =
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
      {...(rightIcon && { rightIcon: <Icon name={rightIcon} /> })}
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
