import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Progress",
    description: "Progress",
    children: [],
    props: {
      ...requiredModifiers.progress,
      ...(props.props || {}),
    },
  };
};
