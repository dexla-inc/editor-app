import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const defaultValues = requiredModifiers.autocomplete;

  return {
    id: nanoid(),
    name: "Autocomplete",
    description: "Autocomplete",
    props: {
      ...defaultValues,
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
