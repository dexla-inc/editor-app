import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { getColorValue } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Timeline as MantineTimeline, TimelineItemProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TimelineItemProps;

const TimelineItemComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, icon, iconColor, ...componentProps } =
      component.props as any;
    const theme = useEditorStore((state) => state.theme);
    console.log("TimelineItemComponent", componentProps);
    return (
      <MantineTimeline.Item
        ref={ref}
        bullet={
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
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineTimeline.Item>
    );
  },
);
TimelineItemComponent.displayName = "TimelineItem";

export const TimelineItem = memo(
  withComponentWrapper<Props>(TimelineItemComponent),
  isSame,
);
