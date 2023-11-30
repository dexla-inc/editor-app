import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { DividerProps, Divider as MantineDivider } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & DividerProps;

const DividerComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineDivider
      {...props}
      {...componentProps}
      style={{ ...props.style, width: "100%" }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDivider>
  );
};

export const Divider = memo(DividerComponent, isSame);
