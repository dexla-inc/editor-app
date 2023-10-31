import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabProps;

const TabComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, ...componentProps } = component.props as any;

  return (
    <MantineTabs.Tab
      icon={icon ? <Icon name={icon} /> : null}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs.Tab>
  );
};

export const Tab = memo(TabComponent, isSame);
