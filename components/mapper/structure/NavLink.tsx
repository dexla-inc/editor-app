import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "NavLink",
    description: "Navigation Item",
    props: {
      label: "Navigation Item",
      style: {
        width: "100%",
        height: "auto",
      },
      ...(props.props || {}),
    },
  };
};
