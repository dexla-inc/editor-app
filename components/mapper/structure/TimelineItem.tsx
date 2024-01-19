import { defaultTheme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultText = structureMapper["Text"].structure({});
  return {
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
          children: "You've created new branch fix-notifications from master",
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
  };
};
