import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabsListProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabsListProps;

const TabsListComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTabs.List {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs.List>
  );
};

export const TabsList = memo(TabsListComponent, isSame);
