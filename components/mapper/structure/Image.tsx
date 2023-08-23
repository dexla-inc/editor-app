import { defaultImageValues } from "@/components/modifiers/Image";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Image",
    description: "Image",
    props: {
      style: {
        width: "200px",
        height: "150px",
        position: "relative",
      },
      ...defaultImageValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
