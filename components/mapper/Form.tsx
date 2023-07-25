import { Component } from "@/utils/editor";
import { Flex as MantineFlex, FlexProps, Button } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const Form = ({ renderTree, component, ...props }: Props) => {
  const { children, style, triggers, ...componentProps } =
    component.props as any;

  return (
    <MantineFlex
      {...props}
      {...componentProps}
      component="form"
      style={{ ...style }}
      {...triggers}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineFlex>
  );
};
