import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { px } from "@mantine/core";

export const jsonStructure = (props?: any): Component => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "100%"
  }`;

  return {
    id: nanoid(),
    name: "Container",
    description: "AppBar Container",
    props: {
      style: {
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
        paddingTop: px(theme.spacing.sm),
        paddingBottom: px(theme.spacing.sm),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
        width: columnsToWidth,
        height: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
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
          children: "App Name",
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            color: theme.colors.dark[6],
            width: "auto",
            height: "auto",
          },
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
        },
      },
    ],
  };
};
