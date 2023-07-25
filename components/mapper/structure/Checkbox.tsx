import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Checkbox",
    description: "Checkbox",
    props: {
      label: "Checkbox Label",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
