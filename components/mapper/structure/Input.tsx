import { defaultTheme } from "@/utils/branding";
import { getDefaultBorderStyle } from "@/utils/defaultsStructure";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const defaultBorderStyle = getDefaultBorderStyle(theme);

  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      ...requiredModifiers.input,
      style: {
        width: "100%",
        height: "38px",
        ...defaultBorderStyle,
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Secondary.1", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
