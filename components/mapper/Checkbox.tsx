import { Component } from "@/utils/editor";
import { Checkbox as MantineCheckbox, CheckboxProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & CheckboxProps;

export const Checkbox = ({ renderTree, component, ...props }: Props) => {
  const { label, ...componentProps } = component.props as any;

  return <MantineCheckbox {...props} {...componentProps} label={label} />;
};
