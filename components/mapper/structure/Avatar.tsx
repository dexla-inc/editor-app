import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Avatar",
    description: "Avatar",
    children: [],
    props: {
      dataType: "static",
      color: "Primary.6",
      radius: "xl",
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
