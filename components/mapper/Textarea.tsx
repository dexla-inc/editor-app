import { Component } from "@/utils/editor";
import { Textarea as MantineTextarea, TextareaProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextareaProps;

export const Textarea = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTextarea {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTextarea>
  );
};
