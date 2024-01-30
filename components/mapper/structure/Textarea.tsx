import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const defaultValues = requiredModifiers.textarea;

  return {
    id: nanoid(),
    name: "Textarea",
    description: "Textarea",
    props: {
      ...defaultValues,
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Secondary.1", textColor: "PrimaryText.9" } },
    children: [],
  };
};
