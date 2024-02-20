import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const defaultValues = requiredModifiers.autocomplete;

  return {
    id: nanoid(),
    name: "Autocomplete",
    description: "Autocomplete",
    props: {
      ...defaultValues,
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Neutral.7", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
