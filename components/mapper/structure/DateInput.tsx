import { getDefaultBorderStyle } from "@/utils/defaultsStructure";
import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  // requiredModifiers.dateInput
  const defaultBorderStyle = getDefaultBorderStyle(props.theme);
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
        ...defaultBorderStyle,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
