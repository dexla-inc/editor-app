import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "DateInput",
    description: "Date Input",
    props: {
      placeholder: "Date Input",
      style: {
        width: "100%",
        height: "auto",
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
