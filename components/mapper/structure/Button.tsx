import { defaultTheme } from "@/components/IFrame";
import { defaultButtonValues } from "@/components/modifiers/Button";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const { value, textColor, color, ...rest } = props.props ?? {};

  // With no-code I think we should remove padding as a default on buttons and let compact / non-compact settings drive it
  const paddingX = theme.hasCompactButtons ? `8px` : `18px`;
  const paddingY = theme.hasCompactButtons ? `5px` : `10px`;

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      ...defaultButtonValues,
      style: {
        width: "fit-content",
        height: "auto",
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
      },
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
      children: value ?? "Button",
    },
    blockDroppingChildrenInside: true,
  };
};
