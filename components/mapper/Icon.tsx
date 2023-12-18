import { Icon as BaseIconComponent } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

const IconComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <BaseIconComponent {...props} {...triggers} {...componentProps} ref={ref}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </BaseIconComponent>
    );
  },
);
IconComponent.displayName = "Icon";

export const Icon = memo(withComponentWrapper<Props>(IconComponent), isSame);
