import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const defaultValues = requiredModifiers.textarea;

  return {
    id: nanoid(),
    name: "Text Editor",
    description: "Text Editor",
    props: {
      ...defaultValues,
      style: {
        height: "fit-content",
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    children: [],
    blockDroppingChildrenInside: true,
  };
};
