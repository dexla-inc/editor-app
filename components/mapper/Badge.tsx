import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { BadgeProps, Badge as MantineBadge } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BadgeProps;

const BadgeComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;
  let value = children;
  return (
    <MantineBadge {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : value}
    </MantineBadge>
  );
};

export const Badge = memo(BadgeComponent, isSame);
