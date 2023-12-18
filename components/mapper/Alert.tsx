import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<AlertProps, "title">;

const AlertComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, ...componentProps } = component.props as any;

  return (
    <MantineAlert
      {...(icon && { icon: <Icon name={icon} /> })}
      {...props}
      {...componentProps}
      style={{ ...props.style }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAlert>
  );
};

export const Alert = memo(AlertComponent, isSame);
