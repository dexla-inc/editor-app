import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const defaultValues = requiredModifiers.select;

  return {
    id: nanoid(),
    name: "Select",
    description: "Select",
    props: {
      style: {
        width: "220px",
      },
      ...defaultValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
