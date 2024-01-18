import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { value, textColor, color, ...rest } = props.props ?? {};

  const defaultValues = requiredModifiers.button;

  return {
    id: nanoid(),
    name: "Button",
    description: "Button",
    props: {
      ...defaultValues,
      style: {
        paddingLeft: "18px",
        paddingRight: "18px",
        borderRadius: "4px",
        width: "fit-content",
      },
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
      children: value ?? "Button",
    },
    states: {
      hover: { color: "Primary.8" },
      disabled: {
        color: "Secondary.6",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
