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
    onLoad: {
      children: {
        value: value ?? "Button",
        dataType: "static",
      },
    },
    props: {
      ...defaultValues,
      color: color ?? "Primary.6",
      textColor: textColor ?? "PrimaryText.6",
      ...(rest || {}),
    },
    states: {
      hover: { color: "Primary.7" },
      disabled: {
        color: "Secondary.6",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
