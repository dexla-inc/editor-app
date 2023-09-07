import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabsPanelProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabsPanelProps;

const TabsPanelComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTabs.Panel {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs.Panel>
  );
};

export const TabsPanel = memo(TabsPanelComponent, isSame);
