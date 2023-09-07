import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Avatar as MantineAvatar, AvatarProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AvatarProps;

const AvatarComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineAvatar {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAvatar>
  );
};

export const Avatar = memo(AvatarComponent, isSame);
