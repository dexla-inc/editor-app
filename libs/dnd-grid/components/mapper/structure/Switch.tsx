import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const defaultLayoutValues = requiredModifiers.layout;

  return {
    id: nanoid(),
    name: "Switch",
    description: "Switch",
    props: {
      style: {
        gridColumn: "1/4",
        gridRow: "1/3",
      },
      ...(props.props || {}),
    },
    onLoad: {
      value: {
        static: false,
        dataType: "static",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
