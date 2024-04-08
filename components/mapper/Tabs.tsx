import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Tabs as MantineTabs, TabsProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & TabsProps;

const TabsComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineTabs ref={ref} {...props} {...componentProps} keepMounted={false}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                // TODO: get this back
                // props: { ...child.props, tabVariant: componentProps.variant },
              }),
            )
          : children}
      </MantineTabs>
    );
  },
);
TabsComponent.displayName = "Tabs";

export const Tabs = memo(withComponentWrapper(TabsComponent), isSame);
