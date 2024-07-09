import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      ...requiredModifiers.input,
      style: {
        width: "100%",
      },
      ...(props.props || {}),
    },
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    blockDroppingChildrenInside: true,
  };
};
