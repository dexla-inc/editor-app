import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { name, style, ...rest } = props.props ?? {};

  return {
    id: nanoid(),
    name: "FileButton",
    description: "File Upload Button",
    onLoad: {
      name: {
        dataType: "static",
        static: name ?? "Upload",
      },
    },
    props: {
      ...requiredModifiers.fileButton,
      style: {
        gridColumn: "1/12",
        gridRow: "1/4",
      },
      ...(rest || {}),
    },
    states: {
      hover: { color: "Primary.7" },
      disabled: {
        color: "Neutral.6",
        textColor: "Neutral.9",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
