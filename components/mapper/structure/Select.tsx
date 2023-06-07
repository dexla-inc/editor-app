import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Select",
    description: "Select",
    props: {
      placeholder: "Select",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
  };
};
