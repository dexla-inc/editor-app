import { theme } from "@/pages/_app";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const style = props?.props?.style ?? {};

  return {
    id: nanoid(),
    name: "Text",
    description: "Text",
    children: [],
    props: {
      children: "New text",
      style: {
        fontSize: theme.fontSizes.sm,
        fontWeight: "normal",
        lineHeight: "110%",
        letterSpacing: "0px",
        color: theme.colors.dark[6],
        ...(style ?? {}),
      },
      ...(props.props ?? {}),
    },
  };
};
