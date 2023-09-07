import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & SelectProps;

const SelectComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineSelect {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineSelect>
  );
};

export const Select = memo(SelectComponent, isSame);
