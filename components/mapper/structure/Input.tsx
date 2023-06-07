import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Input",
    description: "Input",
    props: {
      placeholder: "Input",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
  };
};
