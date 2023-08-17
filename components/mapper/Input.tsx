import { Component } from "@/utils/editor";
import { TextInputProps, TextInput as MantineInput } from "@mantine/core";
import { Icon } from "@/components/Icon";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextInputProps;

export const Input = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, ...componentProps } = component.props as any;
  const { name: iconName } = icon && icon!.props!;
  return (
    <MantineInput
      id={component.id}
      icon={iconName ? <Icon name={iconName} /> : null}
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
