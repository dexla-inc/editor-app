import { Component } from "@/utils/editor";
import { TextInputProps, TextInput as MantineInput } from "@mantine/core";
import { Icon } from "@/components/Icon";
import debounce from "lodash.debounce";
import { isSame } from "@/utils/componentComparison";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextInputProps;

const InputComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, triggers, ...componentProps } =
    component.props as any;
  const { name: iconName } = icon && icon!.props!;

  const debouncedOnChange = debounce((e) => {
    triggers?.onChange(e);
  }, 400);

  return (
    <MantineInput
      id={component.id}
      icon={iconName ? <Icon name={iconName} /> : null}
      styles={{ root: { display: "block !important" } }}
      {...props}
      {...componentProps}
      onChange={triggers?.onChange ? debouncedOnChange : undefined}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineInput>
  );
};

export const Input = memo(InputComponent, isSame);
