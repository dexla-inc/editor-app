import { defaultTheme } from "@/utils/branding";
import { getDefaultBorderStyle } from "@/utils/defaultsStructure";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultBorderStyle = getDefaultBorderStyle(theme);

  return {
    id: nanoid(),
    name: "Textarea",
    description: "Textarea",
    props: {
      name: "Textarea",
      placeholder: "Textarea",
      style: {
        width: "100%",
        ...defaultBorderStyle,
      },
      ...(props.props || {}),
    },
    children: [],
  };
};
