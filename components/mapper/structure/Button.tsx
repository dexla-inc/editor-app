import { defaultButtonValues } from "@/components/modifiers/Button";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
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
      ...defaultButtonValues,
      style: {
        width: "fit-content",
      },
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
      children: value ?? "Button",
    },
    blockDroppingChildrenInside: true,
  };
};
