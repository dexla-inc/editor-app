import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      style: {
        width: "100%",
        height: "auto",
        minWidth: "220px",
      },
      ...requiredModifiers.input,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
