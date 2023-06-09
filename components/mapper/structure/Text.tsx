import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Text",
    description: "Text",
    children: [],
    props: {
      children: "New text",
      style: {
        fontSize: `${px(theme.fontSizes.sm)}px`,
        fontWeight: "normal",
        lineHeight: "110%",
        letterSpacing: "0px",
        color: theme.colors.dark[6],
        width: "auto",
        heigh: "auto",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
