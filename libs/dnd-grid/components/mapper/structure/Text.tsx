import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Text",
    description: "Text",
    blockDroppingChildrenInside: true,
    props: {
      bg: "bg-white",
      textColor: "text-black",
      style: {
        gridColumn: "1/6",
        gridRow: "1/3",
      },
    },
  };
};
