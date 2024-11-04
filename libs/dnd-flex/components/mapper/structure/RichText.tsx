import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const defaultValues = requiredModifiers.textarea;

  return {
    id: nanoid(),
    name: "RichText",
    description: "Rich Text",
    props: {
      ...defaultValues,
      style: {
        width: "300px",
        height: "fit-content",
      },
      ...(props.props || {}),
    },
    onLoad: {
      placeholder: { dataType: "static", static: "Enter your message here..." },
    },
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    children: [],
    blockDroppingChildrenInside: true,
  };
};
