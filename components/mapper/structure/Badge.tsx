import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Badge",
    description: "Badge",
    children: [],
    props: {
      children: "New badge",
      radius: "xl",
      size: "md",
      color: "PrimaryText.6",
      bg: "Primary.6",
      ...(props.props || {}),
    },
    states: {
      hover: { bg: "Primary.7" },
      disabled: {
        bg: "Neutral.6",
        textColor: "Neutral.9",
      },
    },
    blockDroppingChildrenInside: true,
  };
};
