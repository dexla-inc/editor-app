import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "Checkbox",
    description: "Checkbox",
    props: {
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Secondary.5", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
