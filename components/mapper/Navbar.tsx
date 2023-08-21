import { Component } from "@/utils/editor";
import { BoxProps, Box as MantineBox } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Navbar = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <MantineBox
      style={{
        position: "sticky",
        top: "0",
        height: "100vh",
        width: style.width,
      }}
    >
      <MantineBox
        style={{ ...style, position: "absolute", left: 0, top: 0 }}
        {...props}
        {...componentProps}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineBox>
    </MantineBox>
  );
};
