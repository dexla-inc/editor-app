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
      style: {
        gridColumn: "1/20",
        gridRow: "1/1",
      },
      ...(props.props || {}),
    },
    onLoad: {
      value: {
        static: 50,
        dataType: "static",
      },
    },
  };
};
