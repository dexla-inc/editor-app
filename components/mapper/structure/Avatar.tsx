import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  return {
    id: nanoid(),
    name: "Avatar",
    description: "Avatar",
    children: [],
    onLoad: {
      children: "TM",
    },
    props: {
      color: "Primary.6",
      radius: "xl",
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
