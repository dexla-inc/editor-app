import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabsProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabsProps;

export const Tabs = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTabs {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs>
  );
};
