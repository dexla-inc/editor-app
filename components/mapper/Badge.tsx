import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useThemeStore } from "@/stores/theme";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { BadgeProps, Badge as MantineBadge } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useComputeValue } from "@/hooks/useComputeValue";
type Props = EditableComponentMapper & BadgeProps;

const BadgeComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );
    const { style, color, variable, ...componentProps } =
      component.props as any;

    const theme = useThemeStore((state) => state.theme);
    const customStyle = merge({}, style, {
      color: getColorFromTheme(theme, color),
      textTransform: "none",
    });

    const childrenValue = useComputeValue({
      componentId: component.id!,
      field: "children",
      shareableContent,
      staticFallback: component.props?.children,
    });

    return (
      <MantineBadge
        {...contentEditableProps}
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
          : childrenValue?.toString()}
      </MantineBadge>
    );
  },
);
BadgeComponent.displayName = "Badge";

export const Badge = memo(withComponentWrapper<Props>(BadgeComponent), isSame);
