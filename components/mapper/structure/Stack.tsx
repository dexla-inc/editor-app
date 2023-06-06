import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Stack",
    description: "Stack",
    props: {
      style: {
        width: "100%",
        height: "auto",
        minHeight: "100px",
      },
      ...(props.props || {}),
    },
  };
};
