import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useEditorStore } from "@/stores/editor";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { BadgeProps, Badge as MantineBadge } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BadgeProps;

const BadgeComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, style, color, variable, ...componentProps } =
      component.props as any;
    const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
    const selectedVariable = getSelectedVariable(variable);

    useEffect(() => {
      if (selectedVariable?.defaultValue === children) return;
      handleValueUpdate(component.id as string, selectedVariable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVariable]);

    let value = children;
    const theme = useEditorStore((state) => state.theme);
    const customStyle = merge({}, style, {
      color: getColorFromTheme(theme, color),
      textTransform: "none",
    });

    return (
      <MantineBadge
        ref={ref}
        styles={{
          inner: customStyle,
          root: DISABLED_HOVER,
        }}
        {...props}
        {...componentProps}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : value}
      </MantineBadge>
    );
  },
);
BadgeComponent.displayName = "Badge";

export const Badge = memo(withComponentWrapper<Props>(BadgeComponent), isSame);
