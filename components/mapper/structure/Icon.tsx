import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Icon",
    description: "Icon",
    children: [],
    props: {
      ...requiredModifiers.icon,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
