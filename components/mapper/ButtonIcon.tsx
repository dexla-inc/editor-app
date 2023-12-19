import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  ActionIconProps,
  ActionIcon as MantineActionIcon,
} from "@mantine/core";
import { ReactElement, forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ActionIconProps &
  ReactElement<"Button">;

const ButtonIconComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <MantineActionIcon
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        sx={{
          "&:hover": {
            backgroundColor: "unset",
          },
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                props: { ...child.props, ...triggers },
              }),
            )
          : children}
      </MantineActionIcon>
    );
  },
);
ButtonIconComponent.displayName = "ButtonIcon";

export const ButtonIcon = memo(
  withComponentWrapper<Props>(ButtonIconComponent),
  isSame,
);
