import { Icon as BaseIconComponent } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

const IconComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;

  return (
    <BaseIconComponent {...props} {...triggers} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </BaseIconComponent>
  );
};

export const Icon = memo(IconComponent, isSame);
