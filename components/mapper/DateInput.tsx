import { Component } from "@/utils/editor";
import { DateInput as MantineDateInput, DateInputProps } from "@mantine/dates";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & DateInputProps;

export const DateInput = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineDateInput {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDateInput>
  );
};
