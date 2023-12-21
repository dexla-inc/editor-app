import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, icon, ...componentProps } = component.props as any;

    return (
      <MantineAlert
        ref={ref}
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
  },
);
AlertComponent.displayName = "Alert";

export const Alert = memo(withComponentWrapper<Props>(AlertComponent), isSame);
