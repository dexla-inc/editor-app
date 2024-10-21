import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Icon",
    description: "Icon",
    children: [],
    props: {
      ...requiredModifiers.icon,
      size: "md",
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
