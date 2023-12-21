import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & SwitchProps;

const SwitchComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { label, ...componentProps } = component.props as any;

    return (
      <MantineSwitch
        ref={ref}
        {...props}
        {...componentProps}
        label={undefined}
      />
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent), isSame);
