import { defaultInputValues } from "@/components/modifiers/Input";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      style: {
        width: "100%",
        height: "auto",
        minWidth: "220px",
        borderWidth: "1px",
        borderStyle: "solid",
      },
      ...defaultInputValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
