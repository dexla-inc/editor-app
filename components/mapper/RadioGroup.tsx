import { Component } from "@/utils/editor";
import { Radio as MantineRadio, RadioGroupProps } from "@mantine/core";
import { useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & RadioGroupProps;

export const RadioGroup = ({
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
    </MantineRadio.Group>
  );
};
