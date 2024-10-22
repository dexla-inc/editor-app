import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "DateInput",
    description: "Date Input",
    props: {
      ...requiredModifiers.dateInput,
      placeholder: "DD MMM YYYY",
      size: "sm",
      style: {
        gridColumn: "1/18",
        gridRow: "1/4",
      },
      ...(props.props || {}),
    },
    onLoad: {
      valueFormat: {
        static: "DD MMM YYYY",
        dataType: "static",
      },
      type: {
        static: "default",
        dataType: "static",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
