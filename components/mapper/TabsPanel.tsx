import { EditableComponentMapper } from "@/utils/editor";
import { Tabs as MantineTabs, TabsPanelProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & TabsPanelProps;

const TabsPanelComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineTabs.Panel ref={ref} {...props} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children}
      </MantineTabs.Panel>
    );
  },
);
TabsPanelComponent.displayName = "TabsPanel";

export const TabsPanel = memo(withComponentWrapper<Props>(TabsPanelComponent));
