import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Group, Radio as MantineRadio, RadioGroupProps } from "@mantine/core";
import { memo, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & RadioGroupProps;

const RadioComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const { children, value, ...componentProps } = component.props as any;
  const [_value, setValue] = useState(value);

  const defaultTriggers = isPreviewMode
    ? {
        onChange: (val: string) => {
          setValue(val);
        },
      }
    : {
        onChange: (e: any) => {
          setValue(undefined);
        },
      };

  return (
    <MantineRadio.Group {...props} {...defaultTriggers} {...componentProps}>
      <Group mt="xs">
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                props: {
                  ...child.props,
                  isInsideGroup: isPreviewMode,
                  checked: isPreviewMode
                    ? child?.props?.value?.toString() === _value?.toString()
                    : false,
                },
              })
            )
          : children}
      </Group>
    </MantineRadio.Group>
  );
};

export const Radio = memo(RadioComponent, isSame);
