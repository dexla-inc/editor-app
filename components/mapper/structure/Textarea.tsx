import { defaultTheme } from "@/utils/branding";
import { getDefaultBorderStyle } from "@/utils/defaultsStructure";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultBorderStyle = getDefaultBorderStyle(theme);
  const defaultValues = requiredModifiers.textarea;

  return {
    id: nanoid(),
    name: "Textarea",
    description: "Textarea",
    props: {
      ...defaultValues,
      style: {
        ...defaultBorderStyle,
      },
      ...(props.props || {}),
    },
    children: [],
  };
};
