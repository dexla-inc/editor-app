import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { BoxProps, Box as MantineBox } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const NavbarComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineBox {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineBox>
  );
};

export const Navbar = memo(NavbarComponent, isSame);
