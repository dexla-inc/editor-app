import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Alert as MantineAlert, AlertProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AlertProps;

const AlertComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAlert {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAlert>
  );
};

export const Alert = memo(AlertComponent, isSame);
