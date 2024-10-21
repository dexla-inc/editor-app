import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const defaultValues = requiredModifiers.textarea;

  return {
    id: nanoid(),
    name: "Textarea",
    description: "Textarea",
    props: {
      ...defaultValues,
      style: {
        gridColumn: "1/30",
        gridRow: "1/8",
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    children: [],
    blockDroppingChildrenInside: true,
  };
};
