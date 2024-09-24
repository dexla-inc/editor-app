import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useThemeStore } from "@/stores/theme";
import { DISABLED_HOVER } from "@/utils/branding";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { BadgeProps, Badge as MantineBadge } from "@mantine/core";
import merge from "lodash.merge";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";
type Props = EditableComponentMapper & BadgeProps;

const BadgeComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );
    const {
      style,
      size,
      fontTag,
      color,
      variable,
      triggers,
      ...componentProps
    } = component.props as any;
    const { children: childrenValue = componentProps?.children } =
      component.onLoad;
    const { badgeStyle } = useBrandingStyles({ tag: fontTag, size });

    const theme = useThemeStore((state) => state.theme);
    const customStyle = merge({}, badgeStyle, style, {
      color: getColorFromTheme(theme, color),
      textTransform: "none",
    });

    return (
      <MantineBadge
        {...contentEditableProps}
        ref={ref}
        styles={{
          inner: omit(customStyle, ["height"]),
          root: { height: customStyle?.height, ...DISABLED_HOVER },
        }}
        {...props}
        {...componentProps}
        {...triggers}
      >
        {String(childrenValue)}
      </MantineBadge>
    );
  },
);
BadgeComponent.displayName = "Badge";

export const Badge = memo(withComponentWrapper<Props>(BadgeComponent));
