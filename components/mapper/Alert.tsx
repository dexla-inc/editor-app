import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { icon, iconColor, color, triggers, ...componentProps } =
      component.props as any;
    const { children: childrenValue } = component?.onLoad;
    const theme = useThemeStore((state) => state.theme);
    const colorHex = get(theme.colors, color);
    const iconColorHex = get(theme.colors, iconColor);

    return (
      <MantineAlert
        ref={ref}
        {...(icon && {
          icon: (
            <Icon
              name={icon}
              // @ts-ignore
              color={iconColorHex}
            />
          ),
        })}
        {...props}
        {...componentProps}
        {...triggers}
        style={{ ...props.style }}
        styles={{
          root: {
            backgroundColor: colorHex,
          },
        }}
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
