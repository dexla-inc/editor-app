import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  const columnsToWidth = `${
    props.columns ? `${(props.columns * 100) / 12}%` : "auto"
  }`;

  return {
    id: nanoid(),
    name: "Breadcrumb",
    description: "Breadcrumb",
    props: {
      style: {
        width: columnsToWidth,
        height: "auto",
      },
      separator: "•",
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        onLoad: {
          children: {
            dataType: "static",
            value: "Home",
          },
        },
        props: {
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "fit-content",
            height: "fit-content",
          },
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        onLoad: {
          children: {
            dataType: "static",
            value: "Settings",
          },
        },
        props: {
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "fit-content",
            height: "fit-content",
          },
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Breadcrumb Item",
        children: [],
        onLoad: {
          children: {
            dataType: "static",
            value: "About",
          },
        },
        props: {
          color: `${theme.colors.Black ? "Black.6" : "dark"}`,
          style: {
            fontSize: `${px(theme.fontSizes.xs)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "fit-content",
            height: "fit-content",
          },
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
