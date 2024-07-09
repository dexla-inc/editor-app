import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "CheckboxItem",
    description: "Checkbox Item",
    props: {
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      // TODO: Get size from branding
      size: "sm",
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
