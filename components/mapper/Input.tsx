import { Component } from "@/utils/editor";
import { TextInputProps, TextInput as MantineInput } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextInputProps;

export const Input = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineInput
      id={component.id}
      styles={{ root: { display: "block !important" } }}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineInput>
  );
};
