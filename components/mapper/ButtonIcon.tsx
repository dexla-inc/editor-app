import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  ActionIconProps,
  ActionIcon as MantineActionIcon,
} from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ActionIconProps &
  ReactElement<"Button">;

const ButtonIconComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, color, ...componentProps } =
      component.props as any;
    const { color: bgColor } = useChangeState({
      bg: undefined,
      textColor: color,
    });
    const { buttonIconStyle } = useBrandingStyles();
    const customStyle = merge({}, buttonIconStyle, props.style, {
      backgroundColor: bgColor,
    });

    return (
      <MantineActionIcon
        ref={ref}
        {...props}
        {...componentProps}
        style={customStyle}
        styles={{ root: DISABLED_HOVER }}
        {...triggers}
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
