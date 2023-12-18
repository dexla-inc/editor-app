import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { value, textColor, color, ...rest } = props.props ?? {};

  // const paddingX = theme.hasCompactButtons ? `0.5rem` : `1.125rem`;
  // const height = theme.hasCompactButtons ? `1.625rem` : `2.25rem`;

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      ...requiredModifiers.button,
      style: {
        width: "fit-content",
        paddingLeft: "18px",
        paddingRight: "18px",
      },
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
      children: value ?? "Button",
    },
    blockDroppingChildrenInside: true,
  };
};
