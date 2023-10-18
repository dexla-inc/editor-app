import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Menu as MantineMenu, MenuProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & MenuProps;

const MenuComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineMenu {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineMenu>
  );
};

export const Menu = memo(MenuComponent, isSame);
