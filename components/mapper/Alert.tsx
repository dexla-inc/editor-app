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
    const { children, icon, iconColor, ...componentProps } =
      component.props as any;
    const theme = useThemeStore((state) => state.theme);
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
        style={{ ...props.style }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children?.toString()}
      </MantineAlert>
    );
  },
);
AlertComponent.displayName = "Alert";

export const Alert = memo(withComponentWrapper<Props>(AlertComponent));
