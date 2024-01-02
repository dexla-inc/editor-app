import { Component, getColorFromTheme } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultTheme } from "@/utils/branding";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  return {
    id: nanoid(),
    name: "Textarea",
    description: "Textarea",
    props: {
      name: "Textarea",
      placeholder: "Textarea",
      style: {
        width: "100%",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: getColorFromTheme(theme, "Border.6"),
        borderTopColor: getColorFromTheme(theme, "Border.6"),
        borderBottomColor: getColorFromTheme(theme, "Border.6"),
        borderLeftColor: getColorFromTheme(theme, "Border.6"),
        borderRightColor: getColorFromTheme(theme, "Border.6"),
      },
      ...(props.props || {}),
    },
    children: [],
  };
};
