import { getDefaultBorderStyle } from "@/utils/defaultsStructure";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  // requiredModifiers.dateInput
  const defaultBorderStyle = getDefaultBorderStyle(props.theme);

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
        ...defaultBorderStyle,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
