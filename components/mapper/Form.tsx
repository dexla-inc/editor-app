import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

const FormComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;

  return (
    <MantineFlex {...props} {...componentProps} component="form" {...triggers}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree({
              ...child,
              props: { ...child.props, ...triggers },
            })
          )
        : children}
    </MantineFlex>
  );
};

export const Form = memo(FormComponent, isSame);
