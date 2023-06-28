import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabsListProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabsListProps;

export const TabsList = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTabs.List {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs.List>
  );
};
