import { isSame } from "@/utils/componentComparison";
import {
  EditableComponentMapper,
  getAllChildrenComponents,
} from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useState } from "react";

type Props = EditableComponentMapper & RadioProps;

const RadioItemComponent = ({
  renderTree,
  component,
  isPreviewMode,
  shareableContent,
  ...props
}: Props) => {
  const {
    value,
    triggers,
    checked,
    isInsideGroup = false,
    children,
    ...componentProps
  } = component.props as any;

  const [_checked, setChecked] = useState<boolean>(
    isPreviewMode ? checked : false,
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
      {...triggers}
      label={
        component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, {
                ...(checked && {
                  parentState: "checked",
                }),
              }),
            )
          : children
      }
      value={value}
      checked={isPreviewMode ? _checked : false}
      styles={{
        inner: { display: "none" },
        label: {
          padding: 0,
        },
      }}
    />
  );
};

export const RadioItem = memo(RadioItemComponent, isSame);
