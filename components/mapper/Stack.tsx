import { Component } from "@/utils/editor";
import { Stack as MantineStack, StackProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & StackProps;

export const Stack = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineStack className="some-stack" {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineStack>
  );
};
