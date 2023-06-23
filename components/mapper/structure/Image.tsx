import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Image",
    description: "Image",
    props: {
      withPlaceholder: true,
      style: {
        width: "200px",
        height: "150px",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
