import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { getColorValue } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { Tabs as MantineTabs, TabProps } from "@mantine/core";
import { forwardRef, memo } from "react";
type Props = EditableComponentMapper & TabProps;

const TabComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, icon, iconColor, triggers, ...componentProps } =
      component.props as any;
    const theme = useThemeStore((state) => state.theme);

    return (
      <MantineTabs.Tab
        ref={ref}
        icon={
          icon ? (
            <Icon
              name={icon}
              {...(iconColor
                ? { color: getColorValue(theme, iconColor) }
                : null)}
            />
          ) : null
        }
        {...props}
        {...componentProps}
        {...triggers}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children}
      </MantineTabs.Tab>
    );
  },
);
TabComponent.displayName = "Tab";

export const Tab = memo(withComponentWrapper<Props>(TabComponent));
