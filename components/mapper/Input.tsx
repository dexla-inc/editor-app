import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Loader,
  TextInput as MantineInput,
  TextInputProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextInputProps;

const InputComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, triggers, loading, ...componentProps } =
    component.props as any;
  const { name: iconName } = icon && icon!.props!;

  console.log(component);

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
      rightSection={loading ? <Loader size="xs" /> : null}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineInput>
  );
};

export const Input = memo(InputComponent, isSame);
