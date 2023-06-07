import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Link",
    description: "Link",
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
        name: "Text",
        description: "Link Text",
        children: [],
        props: {
          children: "New Link",
          style: {
            fontSize: `${px(theme.fontSizes.sm)}px`,
            fontWeight: "normal",
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "auto",
            heigh: "auto",
            color: theme.colors[theme.primaryColor][6],
          },
          ...(props.props || {}),
        },
      },
    ],
  };
};
