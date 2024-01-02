import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "GoogleMap",
    description: "GoogleMap",
    children: [],
    props: {
      style: {
        width: "100%",
        height: "500px",
      },
      ...requiredModifiers.mapSettings,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
