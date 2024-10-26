import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Divider",
    description: "Divider",
    props: {
      color: "Secondary.6",
      style: {
        gridColumn: "1/30",
        gridRow: "1/1",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
