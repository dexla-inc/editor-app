import { defaultSelectValues } from "@/components/modifiers/Select";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Select",
    description: "Select",
    props: {
      style: {
        width: "100%",
        height: "auto",
        flexDirection: "column",
      },
      ...defaultSelectValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
