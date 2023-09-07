import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  ActionIconProps,
  ActionIcon as MantineActionIcon,
} from "@mantine/core";
import { ReactElement, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ActionIconProps &
  ReactElement<"Button">;

const ButtonIconComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props as any;

  return (
    <MantineActionIcon {...props} {...componentProps} {...triggers}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree({
              ...child,
              props: { ...child.props, ...triggers },
            })
          )
        : children}
    </MantineActionIcon>
  );
};

export const ButtonIcon = memo(ButtonIconComponent, isSame);
