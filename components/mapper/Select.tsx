import { Component } from "@/utils/editor";
import { Select as MantineSelect, SelectProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & SelectProps;

export const Select = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineSelect {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineSelect>
  );
};
