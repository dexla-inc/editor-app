import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { DateInput as MantineDateInput, DateInputProps } from "@mantine/dates";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & DateInputProps;

const DateInputComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineDateInput {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDateInput>
  );
};

export const DateInput = memo(DateInputComponent, isSame);
