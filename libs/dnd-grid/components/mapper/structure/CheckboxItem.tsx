import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "CheckboxItem",
    description: "Checkbox Item",
    props: {
      style: {
        gridColumn: "1/2",
        gridRow: "1/2",
      },
      ...(props.props || {}),
    },
    onLoad: {
      optionValue: {
        static: props?.onLoad?.optionValue?.static ?? "option-1",
        dataType: "static",
      },
    },
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    blockDroppingChildrenInside: true,
  };
};
