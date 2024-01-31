import { Icon as BaseIconComponent } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { DISABLED_HOVER, globalStyles } from "@/utils/branding";
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
    const {
      children,
      iconProps = {},
      triggers,
      color,
      ...componentProps
    } = component.props as any;

    const { color: iconColor, size: iconSize, ...otherIconProps } = iconProps;
    const { color: backgroundColor, backgroundColor: newIconColor } =
      useChangeState({
        bg: iconColor,
        textColor: color,
      });

    const { buttonIconStyle } = useBrandingStyles();

    const customStyle = merge({}, buttonIconStyle, props.style, {
      backgroundColor,
    });

    const iconWidth = globalStyles().sizing.icon[iconSize];
    const iconStyle = merge({}, otherIconProps.style, {
      width: iconWidth,
      height: iconWidth,
      color: newIconColor,
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
        <BaseIconComponent {...otherIconProps} style={iconStyle} />
      </MantineActionIcon>
    );
  },
);
ButtonIconComponent.displayName = "ButtonIcon";

export const ButtonIcon = memo(
  withComponentWrapper<Props>(ButtonIconComponent),
  isSame,
);
