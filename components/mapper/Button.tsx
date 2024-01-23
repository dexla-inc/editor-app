import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useEditorStore } from "@/stores/editor";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent: any;
} & ButtonProps &
  ReactElement<"Button">;

const ButtonComponent = forwardRef(
  (
    {
      renderTree,
      component,
      isPreviewMode,
      style,
      shareableContent,
      ...props
    }: Props,
    ref,
  ) => {
    const {
      children,
      triggers,
      icon,
      iconPosition,
      loading,
      textColor,
      variable,
      dataType,
      ...componentProps
    } = component.props as any;

    const theme = useEditorStore((state) => state.theme);
    const contentEditableProps = useContentEditable(component.id as string);

    const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
    const selectedVariable = getSelectedVariable(variable);

    useEffect(() => {
      if (selectedVariable?.defaultValue === children) return;
      handleValueUpdate(component.id as string, selectedVariable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVariable]);

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

    const { childrenKey } = component.onLoad ?? {};
    const childrenValue =
      dataType === "dynamic" ? shareableContent.data?.[childrenKey] : children;

    return (
      <MantineButton
        {...contentEditableProps}
        {...(icon &&
          iconPosition === "left" && { leftIcon: <Icon name={icon} /> })}
        {...(icon &&
          iconPosition === "right" && { rightIcon: <Icon name={icon} /> })}
        loading={loading}
        {...defaultTriggers}
        {...props}
        {...componentProps}
        {...triggers}
        style={customStyle}
        styles={{ root: DISABLED_HOVER }}
        ref={ref}
      >
        {childrenValue}
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
