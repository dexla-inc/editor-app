import { Component } from "@/utils/editor";
import { Avatar as MantineAvatar, AvatarProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AvatarProps;

export const Avatar = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAvatar {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAvatar>
  );
};
