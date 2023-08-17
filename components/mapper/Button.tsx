import { Component } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { ReactElement } from "react";
import { Icon } from "@/components/Icon";

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
      leftIcon={<Icon name={leftIcon} />}
      {...defaultTriggers}
      {...props}
      {...componentProps}
      {...triggers}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineButton>
  );
};
