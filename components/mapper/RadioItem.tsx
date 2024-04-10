import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useState } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

type Props = EditableComponentMapper & RadioProps;

const RadioItemComponent = ({
  renderTree,
  component,
  isPreviewMode,
  shareableContent,
  ...props
}: Props) => {
  const {
    value: defaultValue,
    children,
    ...componentProps
  } = component.props as any;

  const value = useComputeValue({
    componentId: component.id!,
    field: "value",
    shareableContent,
    staticFallback: defaultValue,
  });

  const { value: parentValue, isInsideGroup = false } = shareableContent;
  const checked = parentValue === value;

  const [_checked, setChecked] = useState<boolean>(checked);

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
      wrapperProps={{ "data-id": component.id }}
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
      checked={_checked}
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
