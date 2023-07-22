import { Component } from "@/utils/editor";
import {
  ActionIconProps,
  ActionIcon as MantineActionIcon,
} from "@mantine/core";
import { ReactElement } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ActionIconProps &
  ReactElement<"Button">;

export const ButtonIcon = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;

  return (
    <MantineActionIcon {...props} {...componentProps} {...triggers}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineActionIcon>
  );
};
