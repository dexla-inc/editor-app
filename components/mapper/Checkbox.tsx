import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Checkbox as MantineCheckbox, CheckboxProps } from "@mantine/core";
import { memo, useState } from "react";
import merge from "lodash.merge";
import { useInputsStore } from "@/stores/inputs";

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
  const setStoreInputValue = useInputsStore((state) => state.setInputValue);

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

  const customStyle = merge({}, props.style);

  return (
    <MantineCheckbox
      {...defaultTriggers}
      {...rest}
      {...componentProps}
      style={{}}
      styles={{
        root: {
          position: "relative",
          width: customStyle.width,
          height: customStyle.height,
          minHeight: customStyle.minHeight,
          minWidth: customStyle.minWidth,
        },
        input: {
          ...customStyle,
          width: "-webkit-fill-available",
          height: "-webkit-fill-available",
          minHeight: "-webkit-fill-available",
          minWidth: "-webkit-fill-available",
        },
      }}
      label={label}
      value={value}
      checked={checked}
      {...triggers}
      onChange={(e) => {
        setStoreInputValue(component.id!, e.target.checked);

        if (triggers?.onChange) {
          triggers?.onChange?.(e);
        } else {
          defaultTriggers.onChange(e);
        }
      }}
    />
  );
};

export const Checkbox = memo(CheckboxComponent, isSame);
