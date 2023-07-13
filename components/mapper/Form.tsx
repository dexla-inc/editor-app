import { Component } from "@/utils/editor";
import { Flex as MantineFlex, FlexProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const Form = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <MantineFlex
      {...props}
      {...componentProps}
      component="form"
      style={{ ...style }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineFlex>
  );
};
