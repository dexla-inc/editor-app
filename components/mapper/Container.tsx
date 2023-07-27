import { Component } from "@/utils/editor";
import { Flex as MantineFlex, FlexProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const Container = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <MantineFlex
      {...props}
      {...componentProps}
      style={{ width: "100%", ...style }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree({
              ...child,
              props: { ...child.props, ...componentProps, ...style },
            })
          )
        : children}
    </MantineFlex>
  );
};
