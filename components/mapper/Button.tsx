import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useEditorStore } from "@/stores/editor";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & ButtonProps &
  ReactElement<"Button">;

const ButtonComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, style, ...props }: Props, ref) => {
    const {
      children,
      triggers,
      leftIcon,
      rightIcon,
      loading,
      textColor,
      ...componentProps
    } = component.props as any;

    const theme = useEditorStore((state) => state.theme);
    const contentEditableProps = useContentEditable(component.id as string);

    const defaultTriggers = isPreviewMode
      ? {}
      : {
          onClick: (e: any) => {
            e.preventDefault();
          },
        };

    const labelTextColor = getColorFromTheme(theme, textColor);

    const borderColor = getColorFromTheme(theme, "Border.6");
    const customStyle = merge({ borderColor, borderWidth: "0px" }, style, {
      color: labelTextColor,
    });

    return (
      <MantineButton
        {...contentEditableProps}
        {...(leftIcon && { leftIcon: <Icon name={leftIcon} /> })}
        {...(rightIcon && { rightIcon: <Icon name={rightIcon} /> })}
        loading={loading}
        {...defaultTriggers}
        {...props}
        {...componentProps}
        {...triggers}
        style={customStyle}
        styles={{ root: DISABLED_HOVER }}
      >
        {children}
      </MantineButton>
    );
  },
);
ButtonComponent.displayName = "Button";

// export const Button = memo(ButtonComponent, isSame);
export const Button = memo(
  withComponentWrapper<Props>(ButtonComponent),
  isSame,
);
