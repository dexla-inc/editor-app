import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import { FormEvent, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & FlexProps;

const FormComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;
  const { onSubmit, ...otherTriggers } = triggers;

  const onSubmitCustom = (e: FormEvent<any>) => {
    e.preventDefault();
    return triggers.onSubmit(e);
  };

  return (
    <MantineFlex
      {...props}
      {...componentProps}
      component="form"
      autoComplete={props.isPreviewMode ? "on" : "off"}
      onSubmit={onSubmitCustom}
      {...otherTriggers}
    >
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
