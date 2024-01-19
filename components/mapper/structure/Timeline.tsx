import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultText = structureMapper["Text"].structure({});
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
  return {
    id: nanoid(),
    name: "Timeline",
    description: "Timeline",
    props: {
      ...requiredModifiers.timeline,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
    children: [
      {
        id: nanoid(),
        name: "TimelineItem",
        description: "Timeline Item",
        props: {
          ...requiredModifiers.timelineItem,
          icon: "IconGitBranch",
          title: "New branch",
        },
        children: [
          {
            ...defaultText,
            id: nanoid(),
            props: {
              children:
                "You've created new branch fix-notifications from master",
            },
          },
          {
            ...defaultText,
            id: nanoid(),
            props: {
              children: "2 hours ago",
              size: "xs",
            },
          },
        ],
      },
      {
        id: nanoid(),
        name: "TimelineItem",
        description: "Timeline Item",
        props: {
          ...requiredModifiers.timelineItem,
          icon: "IconGitCommit",
          title: "Commits",
        },
        children: [
          {
            ...defaultText,
            id: nanoid(),
            props: {
              children: "You've pushed 23 commits to fix-notifications branch",
            },
          },
          {
            ...defaultText,
            id: nanoid(),
            props: {
              children: "52 minutes ago",
              size: "xs",
            },
          },
        ],
      },
      {
        id: nanoid(),
        name: "TimelineItem",
        description: "Timeline Item",
        props: {
          ...requiredModifiers.timelineItem,
          icon: "IconGitPullRequest",
          title: "Pull request",
        },
        children: [
          {
            ...defaultText,
            id: nanoid(),
            props: {
              children:
                "You've submitted a pull request Fix incorrect notification message (#187)",
            },
          },
          {
            ...defaultText,
            id: nanoid(),
            props: {
              children: "34 minutes ago",
              size: "xs",
            },
          },
        ],
      },
    ],
  };
};
