import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      ...requiredModifiers.input,
      style: {
        width: "100%",
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Neutral.7", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
