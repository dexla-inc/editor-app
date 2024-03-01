import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  // requiredModifiers.dateInput
  const defaultValues = requiredModifiers.dateInput;

  return {
    id: nanoid(),
    name: "DateInput",
    description: "Date Input",
    props: {
      ...defaultValues,
      placeholder: "DD MMM YYYY",
      valueFormat: "DD MMM YYYY",
      size: "sm",
      style: {
        ...defaultValues.style,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
