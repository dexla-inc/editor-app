import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, memo, forwardRef } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & ButtonProps &
  ReactElement<"Button">;

const ButtonComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref) => {
    const theme = useEditorStore((state) => state.theme);

    const {
      children,
      triggers,
      leftIcon,
      rightIcon,
      loading,
      textColor,
      color,
      ...componentProps
    } = component.props as any;

    const defaultTriggers = isPreviewMode
      ? {}
      : {
          onClick: (e: any) => {
            e.preventDefault();
          },
        };

    const labelTextColor = getColorFromTheme(theme, textColor);
    const backgroundColor = getColorFromTheme(theme, color);

    const borderColor = getColorFromTheme(theme, "Border.6");
    const customStyle = merge(
      { borderColor, borderWidth: "0px" },
      props.style,
      {
        backgroundColor,
        color: labelTextColor,
      },
    );

    return (
      <MantineButton
        ref={ref}
        {...(leftIcon && { leftIcon: <Icon name={leftIcon} /> })}
        {...(rightIcon && { rightIcon: <Icon name={rightIcon} /> })}
        loading={loading}
        {...defaultTriggers}
        {...props}
        {...componentProps}
        {...triggers}
        style={customStyle}
      >
        {children}
      </MantineButton>
    );
  },
);
ButtonComponent.displayName = "Button";

// export const Button = memo(ButtonComponent, isSame);
export const Button = memo(withComponentWrapper(ButtonComponent), isSame);
