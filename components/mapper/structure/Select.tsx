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
      ...defaultValues,
      style: {
        ...defaultValues.style,
        ...defaultBorderStyle,
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Secondary.1", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
