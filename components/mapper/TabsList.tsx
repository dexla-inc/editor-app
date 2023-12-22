import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Tabs as MantineTabs, TabsListProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TabsListProps;

const TabsListComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, tabVariant, disableLine, ...componentProps } =
      component.props as any;

    const removeLine = tabVariant === "default" && disableLine;

    return (
      <MantineTabs.List
        ref={ref}
        {...props}
        {...componentProps}
        sx={{ borderBottom: removeLine ? "none" : undefined }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineTabs.List>
    );
  },
);
TabsListComponent.displayName = "TabsList";

export const TabsList = memo(
  withComponentWrapper<Props>(TabsListComponent),
  isSame,
);
