import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Autocomplete",
    description: "Autocomplete",
    props: {
      ...requiredModifiers.autocomplete,
      style: {
        gridColumn: "1/30",
        gridRow: "1/4",
      },
      ...(props.props || {}),
    },
    onLoad: {
      data: {
        dataType: "static",
        static: {
          en: [],
        },
      },
    },
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    blockDroppingChildrenInside: true,
  };
};
