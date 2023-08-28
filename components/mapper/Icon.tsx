import { Icon as IconComponent } from "@/components/Icon";
import { Component } from "@/utils/editor";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const Icon = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;

  return (
    <IconComponent {...props} {...triggers} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </IconComponent>
  );
};
