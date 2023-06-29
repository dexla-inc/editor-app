import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Avatar",
    description: "Avatar",
    children: [],
    props: {
      color: "Primary",
      radius: "xl",
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
