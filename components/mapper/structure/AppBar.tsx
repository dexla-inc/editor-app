import { defaultTheme } from "@/components/IFrame";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "100%"
  }`;

  return {
    id: nanoid(),
    name: "AppBar",
    description: "Page Heading",
    props: {
      style: {
        borderBottomWidth: `1px`,
        borderBottomStyle: `solid`,
        borderBottomColor: theme.colors.Border
          ? theme.colors.Border[6]
          : theme.colors.gray[3],
        paddingTop: px(theme.spacing.lg),
        paddingBottom: px(theme.spacing.lg),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
        height: "auto",
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: theme.spacing.md,
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "ButtonIcon",
        description: "Notifications button",
        props: {
          variant: "outline",
          color: "Primary",
          size: "lg",
          radius: "xl",
          blockDroppingChildrenInside: true,
          style: {
            backgroundColor: "white",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            props: {
              name: "IconBell",
            },
            children: [],
            blockDroppingChildrenInside: true,
          },
        ],
      },
      {
        id: nanoid(),
        name: "ButtonIcon",
        description: "Settings button",
        props: {
          variant: "outline",
          color: "Primary",
          size: "lg",
          radius: "xl",
          blockDroppingChildrenInside: true,
          style: {
            backgroundColor: "white",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            props: {
              name: "IconSettings",
            },
            children: [],
            blockDroppingChildrenInside: true,
          },
        ],
      },
      {
        id: nanoid(),
        name: "ButtonIcon",
        description: "Profile button",
        props: {
          variant: "outline",
          color: "Primary",
          size: "lg",
          radius: "xl",
          blockDroppingChildrenInside: true,
          style: {
            backgroundColor: "white",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            props: {
              name: "IconUserCircle",
            },
            children: [],
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
