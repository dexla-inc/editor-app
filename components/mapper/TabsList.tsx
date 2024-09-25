import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Tabs as MantineTabs, TabsListProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & TabsListProps;

const TabsListComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent: defaultShareableContent,
      ...props
    }: Props,
    ref,
  ) => {
    const { children, disableLine, ...componentProps } = component.props as any;

    const { shareableContent, tabVariant } = defaultShareableContent;

    const removeLine = tabVariant === "default" && disableLine;

    return (
      <MantineTabs.List
        ref={ref}
        {...props}
        {...componentProps}
        sx={{ borderBottom: removeLine ? "none" : undefined }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children}
      </MantineTabs.List>
    );
  },
);
TabsListComponent.displayName = "TabsList";

export const TabsList = memo(withComponentWrapper<Props>(TabsListComponent));
