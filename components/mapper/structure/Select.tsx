import { getDefaultBorderStyle } from "@/utils/defaultsStructure";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const defaultBorderStyle = getDefaultBorderStyle(props.theme);
  const defaultValues = requiredModifiers.select;

  return {
    id: nanoid(),
    name: "Select",
    description: "Select",
    props: {
      style: {
        width: "220px",
        ...defaultBorderStyle,
      },
      ...defaultValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
