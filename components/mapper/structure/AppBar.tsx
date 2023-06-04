import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { px } from "@mantine/core";

export const jsonStructure = (props?: any): Component => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  return {
    id: nanoid(),
    name: "Group",
    description: "AppBar Wrapper Group",
    props: {
      position: "apart",
      w: columnsToWidth,
      style: {
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
        paddingTop: px(theme.spacing.sm),
        paddingBottom: px(theme.spacing.sm),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "App Name",
        children: [],
        props: {
          children: "My Company",
          size: "xs",
          w: "auto",
        },
      },
      {
        id: nanoid(),
        name: "Avatar",
        description: "Avatar",
        children: [],
        props: {
          color: "teal",
          radius: "xl",
          w: "auto",
        },
      },
    ],
  };
};
