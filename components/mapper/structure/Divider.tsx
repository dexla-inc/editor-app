import { defaultInputValues } from "@/components/modifiers/Input";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Divider",
    description: "Divider",
    props: {
      style: {
        width: "100%",
        height: "auto",
      },
      ...defaultInputValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
