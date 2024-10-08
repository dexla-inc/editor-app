import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { getColorValue } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { icon, iconColor, color, triggers, ...componentProps } =
      component.props as any;
    const { children: childrenValue } = component?.onLoad;
    const theme = useThemeStore((state) => state.theme);
    const iconColorHex = getColorValue(theme, iconColor);
    const colorHex = getColorValue(theme, color);

    return (
      <MantineAlert
        ref={ref}
        {...(icon && {
          icon: <Icon name={icon} color={iconColorHex} />,
        })}
        variant="light"
        {...props}
        {...componentProps}
        {...triggers}
        styles={{
          root: {
            backgroundColor: colorHex,
          },
        }}
        style={{ ...props.style }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : childrenValue?.toString()}
      </MantineAlert>
    );
  },
);
AlertComponent.displayName = "Alert";

export const Alert = memo(withComponentWrapper<Props>(AlertComponent));
