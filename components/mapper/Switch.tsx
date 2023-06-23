import { Component } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & SwitchProps;

export const Switch = ({ renderTree, component, ...props }: Props) => {
  const { label, ...componentProps } = component.props as any;

  return <MantineSwitch {...props} {...componentProps} label={label} />;
};
