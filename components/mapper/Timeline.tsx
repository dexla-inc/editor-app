import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Timeline as MantineTimeline, TimelineProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TimelineProps;

const TimelineComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineTimeline ref={ref} {...props} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                props: { ...child.props },
              }),
            )
          : children}
      </MantineTimeline>
      // TODO: Williams, something weird is happening, if I uncomment the below out it looks great but for some reason our usual way doesn't work.
      // <MantineTimeline
      //   active={1}
      //   bulletSize="24px"
      //   lineWidth="2px"
      //   align="left"
      //   color="Primary.6"
      // >
      //   <MantineTimeline.Item
      //     bullet={<IconGitBranch size={12} />}
      //     title="New branch"
      //     lineVariant="solid"
      //   >
      //     <Text color="dimmed" size="sm">
      //       You&apos;ve created new branch fix-notifications from master
      //     </Text>
      //     <Text size="xs" mt={4}>
      //       2 hours ago
      //     </Text>
      //   </MantineTimeline.Item>

      //   <MantineTimeline.Item
      //     bullet={<IconGitCommit size={12} />}
      //     title="Commits"
      //   >
      //     <Text color="dimmed" size="sm">
      //       You&apos;ve pushed 23 commits to fix-notifications branch
      //     </Text>
      //     <Text size="xs" mt={4}>
      //       52 minutes ago
      //     </Text>
      //   </MantineTimeline.Item>

      //   <MantineTimeline.Item
      //     title="Pull request"
      //     bullet={<IconGitPullRequest size={12} />}
      //     lineVariant="dashed"
      //   >
      //     <Text color="dimmed" size="sm">
      //       You&apos;ve submitted a pull request Fix incorrect notification
      //       message (#187)
      //     </Text>
      //     <Text size="xs" mt={4}>
      //       34 minutes ago
      //     </Text>
      //   </MantineTimeline.Item>

      //   <MantineTimeline.Item
      //     title="Code review"
      //     bullet={<IconMessageDots size={12} />}
      //   >
      //     <Text color="dimmed" size="sm">
      //       Robert Gluesticker left a code review on your pull request
      //     </Text>
      //     <Text size="xs" mt={4}>
      //       12 minutes ago
      //     </Text>
      //   </MantineTimeline.Item>
      // </MantineTimeline>
    );
  },
);
TimelineComponent.displayName = "Timeline";

export const Timeline = memo(withComponentWrapper(TimelineComponent), isSame);
