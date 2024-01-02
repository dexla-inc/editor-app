import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { value, textColor, color, ...rest } = props.props ?? {};

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
        borderRadius: "4px",
      },
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
      children: value ?? "Button",
    },
    blockDroppingChildrenInside: true,
  };
};
