import { defaultTheme } from "@/utils/branding";
import { Component, getColorFromTheme } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      style: {
        width: "100%",
        height: "38px",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: getColorFromTheme(theme, "Border.6"),
        borderTopColor: getColorFromTheme(theme, "Border.6"),
        borderBottomColor: getColorFromTheme(theme, "Border.6"),
        borderLeftColor: getColorFromTheme(theme, "Border.6"),
        borderRightColor: getColorFromTheme(theme, "Border.6"),
      },
      ...requiredModifiers.input,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
