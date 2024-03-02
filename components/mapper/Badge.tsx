import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useEditorStore } from "@/stores/editor";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { BadgeProps, Badge as MantineBadge } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent: any;
} & BadgeProps;

const BadgeComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const contentEditableProps = useContentEditable(component.id as string);
    const { style, color, variable, ...componentProps } =
      component.props as any;

    const theme = useEditorStore((state) => state.theme);
    const customStyle = merge({}, style, {
      color: getColorFromTheme(theme, color),
      textTransform: "none",
    });

    const { computeValue } = useDataContext()!;
    const childrenValue =
      computeValue({
        value: component.onLoad?.children,
        shareableContent,
      }) ?? component.props?.children;

    return (
      <MantineBadge
        {...contentEditableProps}
        ref={ref ?? contentEditableProps.ref}
        styles={{
          inner: customStyle,
          root: DISABLED_HOVER,
        }}
        {...props}
        {...componentProps}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : childrenValue}
      </MantineBadge>
    );
  },
);
BadgeComponent.displayName = "Badge";

export const Badge = memo(withComponentWrapper<Props>(BadgeComponent), isSame);
