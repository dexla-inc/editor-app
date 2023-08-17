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
  console.log("button", component);
  const { children, triggers, ...componentProps } = component.props as any;

  const defaultTriggers = isPreviewMode
    ? {}
    : {
        onClick: (e: any) => {
          e.preventDefault();
        },
      };

  return (
    <MantineButton
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
