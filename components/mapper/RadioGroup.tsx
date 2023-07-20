import { Component } from "@/utils/editor";
import { Group, Radio as MantineRadio, RadioGroupProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & RadioGroupProps;

export const Tabs = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineRadio.Group {...props} {...componentProps}>
      <Group mt="xs">
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </Group>
    </MantineRadio.Group>
  );
};
