import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  // requiredModifiers.dateInput

  return {
    id: nanoid(),
    name: "DateInput",
    description: "Date Input",
    props: {
      placeholder: "DD MMM YYYY",
      valueFormat: "DD MMM YYYY",
      size: "sm",
      style: {
        width: "100%",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
