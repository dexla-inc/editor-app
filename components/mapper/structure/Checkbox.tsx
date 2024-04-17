import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Checkbox",
    description: "Checkbox",
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
      value: {
        static: false,
        dataType: "static",
      },
    },
    states: { disabled: { bg: "Neutral.7", textColor: "PrimaryText.9" } },
    blockDroppingChildrenInside: true,
  };
};
