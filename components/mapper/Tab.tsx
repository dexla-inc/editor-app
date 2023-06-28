import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabProps;

export const Tab = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineTabs.Tab {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs.Tab>
  );
};
