import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { style: propStyle, ...restProps } = props?.props || {};

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    blockDroppingChildrenInside: false,
    props: {
      bg: "bg-gray-100",
      textColor: "text-black",
      style: {
        gridColumn: "1/30",
        gridRow: "1/10",
      },
    },
  };
};
