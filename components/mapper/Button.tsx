import { Component } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { ReactElement } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ButtonProps &
  ReactElement<"Button">;

export const Button = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineButton {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineButton>
  );
};
