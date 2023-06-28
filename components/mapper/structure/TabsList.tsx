import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "TabsList",
    description: "Tabs List",
    props: {
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Tab",
        description: "Tab",
        props: {
          value: "first",
          style: {
            width: "auto",
            height: "auto",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Tab Text",
            children: [],
            props: {
              children: "First Tab",
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.dark[6],
                width: "auto",
                heigh: "auto",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
      {
        id: nanoid(),
        name: "Tab",
        description: "Tab",
        props: {
          value: "second",
          style: {
            width: "auto",
            height: "auto",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Tab Text",
            children: [],
            props: {
              children: "Second Tab",
              style: {
                fontSize: `${px(theme.fontSizes.sm)}px`,
                fontWeight: "normal",
                lineHeight: "110%",
                letterSpacing: "0px",
                color: theme.colors.dark[6],
                width: "auto",
                heigh: "auto",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
    ],
  };
};
