import { Icon as BaseIconComponent } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { DISABLED_HOVER, globalStyles } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import {
  ActionIconProps,
  ActionIcon as MantineActionIcon,
} from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo } from "react";

type Props = EditableComponentMapper & ActionIconProps & ReactElement<"Button">;

const ButtonIconComponent = forwardRef(
  (
    { component, shareableContent, grid: { ChildrenWrapper }, ...props }: Props,
    ref,
  ) => {
    const {
      children,
      triggers,
      color,
      iconColor,
      iconName,
      iconSize,
      ...componentProps
    } = component.props as any;

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
    const iconProps = {
      name: iconName,
      style: {
        width: iconWidth,
        height: iconWidth,
        color: newIconColor,
      },
    };

    return (
      <MantineActionIcon
        ref={ref}
        {...props}
        {...componentProps}
        style={customStyle}
        styles={{ root: DISABLED_HOVER }}
        {...triggers}
      >
        <ChildrenWrapper>
          <BaseIconComponent {...iconProps} />
        </ChildrenWrapper>
      </MantineActionIcon>
    );
  },
);
ButtonIconComponent.displayName = "ButtonIcon";

export const ButtonIcon = memo(
  withComponentWrapper<Props>(ButtonIconComponent),
);
