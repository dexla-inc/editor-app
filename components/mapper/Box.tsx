import { Component } from "@/utils/editor";
import { Box as MantineBox, BoxProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Box = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineBox {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineBox>
  );
};
