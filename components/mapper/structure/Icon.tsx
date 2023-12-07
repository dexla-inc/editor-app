import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Icon",
    description: "Icon",
    children: [],
    props: {
      name: "IconArrowNarrowRight",
      size: "sm",
      bg: "transparent",
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
