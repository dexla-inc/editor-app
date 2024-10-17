import { defaultTheme } from "@/utils/branding";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Pagination",
    description: "Pagination",
    props: {
      total: 10,
      style: {
        gridColumn: "1/24",
        gridRow: "1/4",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
