import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & SwitchProps;

const SwitchComponent = ({ renderTree, component, ...props }: Props) => {
  const { label, ...componentProps } = component.props as any;

  return <MantineSwitch {...props} {...componentProps} label={undefined} />;
};

export const Switch = memo(SwitchComponent, isSame);
