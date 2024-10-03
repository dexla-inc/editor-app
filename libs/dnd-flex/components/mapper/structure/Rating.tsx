import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Rating",
    description: "Rating",
    props: {
      readOnly: true,
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
