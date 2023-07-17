import { Component } from "@/utils/editor";
import { DividerProps, Divider as MantineDivider } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & DividerProps;

export const Divider = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <MantineDivider
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDivider>
  );
};
