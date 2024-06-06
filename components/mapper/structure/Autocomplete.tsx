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
      value: {
        en: { label: "", value: "" },
      },
    },
    states: { disabled: { bg: "Neutral.7", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
