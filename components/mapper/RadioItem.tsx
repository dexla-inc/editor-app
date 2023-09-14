import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useState } from "react";
import { Icon } from "@/components/Icon";

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
    icon,
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
      label={
        <span
          style={{
            display: "flex",
            gap: 30,
            alignItems: "center",
            height: "100%",
          }}
        >
          {label}
          <Icon name={icon} size={30} />
        </span>
      }
      value={value}
      checked={isPreviewMode ? _checked : false}
      {...triggers}
      styles={{
        inner: { display: "flex", height: "30px", alignItems: "center" },
        label: { height: "100%" },
      }}
    />
  );
};

export const RadioItem = memo(RadioItemComponent, isSame);
