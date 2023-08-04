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
        width: "auto",
        height: "auto",
        flexDirection: "column",
      },
      ...defaultInputValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
