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
        gridColumn: "1/12",
        gridRow: "1/4",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
