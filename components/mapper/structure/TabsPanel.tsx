import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "TabsPanel",
    description: "Tabs Panel",
    props: {
      value: "new-tab",
      style: {
        paddingTop: px(theme.spacing.xl),
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Tab Text",
        children: [],
        props: {
          children: "New Tab Content",
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "auto",
            height: "auto",
            padding: theme.spacing.md,
          },
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
