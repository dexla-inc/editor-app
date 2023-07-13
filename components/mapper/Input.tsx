import { Component } from "@/utils/editor";
import { InputProps, Input as MantineInput } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & InputProps;

export const Input = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineInput {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineInput>
  );
};
