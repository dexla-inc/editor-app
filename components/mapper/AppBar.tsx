import { Component } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const AppBar = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <MantineFlex
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineFlex>
  );
};
