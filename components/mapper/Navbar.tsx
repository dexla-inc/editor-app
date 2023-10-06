import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { BoxProps, Box as MantineBox } from "@mantine/core";
import { memo } from "react";
import { useEditorStore } from "@/stores/editor";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const NavbarComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const { children, bg = "", ...componentProps } = component.props as any;

  const backgroundColor = getColorFromTheme(theme, bg);

  merge(componentProps, { style: { backgroundColor } });

  return (
    <MantineBox {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineBox>
  );
};

export const Navbar = memo(NavbarComponent, isSame);
