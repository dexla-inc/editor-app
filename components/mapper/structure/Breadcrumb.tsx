import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  return {
    id: nanoid(),
    name: "Breadcrumb",
    description: "Breadcrumb",
    props: {
      w: columnsToWidth,
      style: {
        paddingTop: px(theme.spacing.xl),
        paddingBottom: px(theme.spacing.xl),
        paddingLeft: px(theme.spacing.md),
        paddingRight: px(theme.spacing.md),
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        props: {
          children: "Home",
          w: "auto",
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            color: theme.colors.dark[6],
          },
        },
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        props: {
          children: "Settings",
          w: "auto",
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            color: theme.colors.dark[6],
          },
        },
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        props: {
          children: "About",
          w: "auto",
          style: {
            fontSize: `${px(theme.fontSizes.xs)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            color: theme.colors.dark[6],
          },
        },
      },
    ],
  };
};
