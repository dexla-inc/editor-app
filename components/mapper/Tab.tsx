import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { getColorValue } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabProps;

const TabComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, icon, iconColor, ...componentProps } =
    component.props as any;
  const theme = useEditorStore((state) => state.theme);

  return (
    <MantineTabs.Tab
      icon={
        icon ? (
          <Icon
            name={icon}
            {...(iconColor ? { color: getColorValue(theme, iconColor) } : null)}
          />
        ) : null
      }
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTabs.Tab>
  );
};

export const Tab = memo(TabComponent, isSame);
