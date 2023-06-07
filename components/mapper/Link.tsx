import { Component } from "@/utils/editor";
import { Anchor as MantineAnchor, AnchorProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AnchorProps;

export const Link = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAnchor {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAnchor>
  );
};
