import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & RadioProps;

const RadioItemComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const {
    label,
    value,
    triggers,
    checked,
    isInsideGroup = false,
    ...componentProps
  } = component.props as any;

  const [_checked, setChecked] = useState<boolean>(
    isPreviewMode ? checked : false
  );

  const defaultTriggers = isPreviewMode
    ? isInsideGroup
      ? {}
      : {
          onChange: (e: any) => {
            setChecked(e.currentTarget.checked);
          },
        }
    : {
        onChange: (e: any) => {
          e?.preventDefault();
          e?.stopPropagation();
          setChecked(false);
        },
      };

  return (
    <MantineRadio
      {...props}
      {...componentProps}
      {...defaultTriggers}
      label={label}
      value={value}
      checked={isPreviewMode ? _checked : false}
      {...triggers}
    />
  );
};

export const RadioItem = memo(RadioItemComponent, isSame);
