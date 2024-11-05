import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import { Tabs as MantineTabs, TabsProps } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & TabsProps;

const TabsComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;
    const theme = useThemeStore((state) => state.theme);
    const tabItemHoverColor = get(
      theme.colors,
      componentProps.tabItemHoverColor,
    );

    return (
      <MantineTabs
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        keepMounted={false}
        styles={{
          tab: {
            "&:hover": {
              backgroundColor: tabItemHoverColor,
            },
          },
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, {
                ...shareableContent,
                tabVariant: componentProps.variant ?? "default",
              }),
            )
          : children}
      </MantineTabs>
    );
  },
);
TabsComponent.displayName = "Tabs";

export const Tabs = memo(withComponentWrapper(TabsComponent));
