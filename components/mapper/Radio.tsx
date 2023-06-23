import { Component } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & RadioProps;

export const Radio = ({ renderTree, component, ...props }: Props) => {
  const { label, ...componentProps } = component.props as any;

  return <MantineRadio {...props} {...componentProps} label={label} />;
};
