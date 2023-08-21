import { Component } from "@/utils/editor";
import { BoxProps, Box as MantineBox } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Navbar = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <>
      <MantineBox
        style={{ width: style.width, height: "100vh", position: "sticky" }}
      />
      <MantineBox style={style} {...props} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineBox>
    </>
  );
};
