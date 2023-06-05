import { Component } from "@/utils/editor";
import { Group as MantineGroup, GroupProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & GroupProps;

export const Group = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineGroup className="some-group" {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineGroup>
  );
};
