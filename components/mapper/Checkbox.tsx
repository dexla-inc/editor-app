import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Checkbox as MantineCheckbox, CheckboxProps } from "@mantine/core";
import { memo, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & CheckboxProps;

const CheckboxComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const { label, value, triggers, ...componentProps } = component.props as any;
  const { children, ...rest } = props;
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    setChecked((state) => !state);
  };

  const defaultTriggers = isPreviewMode
    ? {
        onChange: (e: any) => {
          toggle();
        },
      }
    : {
        onChange: (e: any) => {
          e.preventDefault();
        },
      };

  return (
    <MantineCheckbox
      {...defaultTriggers}
      {...rest}
      {...componentProps}
      label={label}
      value={value}
      checked={checked}
      {...triggers}
    />
  );
};

export const Checkbox = memo(CheckboxComponent, isSame);
