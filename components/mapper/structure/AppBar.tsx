import { defaultTheme } from "@/components/IFrame";
import { defaultInputValues } from "@/components/modifiers/Input";
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
        name: "Container",
        description: "Container for Image and Icon",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "App Name",
            children: [],
            props: {
              children: "App Name",
              color: `${theme.colors.Black ? "Black.6" : "dark"}`,
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Input",
            description: "Search input",
            props: {
              style: {
                width: "100%",
                height: "auto",
              },
              ...defaultInputValues,
              ...(props.props || {}),
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "ButtonIcon",
            description: "Notifications button",
            props: {
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
              blockDroppingChildrenInside: true,
            },
          },
          {
            id: nanoid(),
            name: "ButtonIcon",
            description: "Settings button",
            props: {
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
              blockDroppingChildrenInside: true,
            },
          },
          {
            id: nanoid(),
            name: "Avatar",
            description: "Avatar",
            children: [],
            props: {
              color: "Primary",
              radius: "xl",
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
