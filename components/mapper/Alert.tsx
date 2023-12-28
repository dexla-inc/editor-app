import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, icon, iconColor, ...componentProps } =
      component.props as any;
    const currentProjectId = useEditorStore((state) => state.currentProjectId);
    const theme = useUserTheme(currentProjectId!);
    const iconColorHex = get(theme?.colors, iconColor);

    return (
      <MantineAlert
        ref={ref}
        {...(icon && {
          icon: <Icon name={icon} color={iconColorHex} />,
        })}
        {...props}
        {...componentProps}
        style={{ ...props.style }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineAlert>
    );
  },
);
AlertComponent.displayName = "Alert";

export const Alert = memo(withComponentWrapper<Props>(AlertComponent), isSame);
