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
