import { Component } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AnchorProps;

export const Link = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;

  return (
    <MantineAnchor {...props} {...componentProps} {...triggers}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree({
              ...child,
              props: { ...child.props, ...triggers },
            })
          )
        : children}
    </MantineAnchor>
  );
};
