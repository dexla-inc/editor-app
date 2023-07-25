import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Radio",
    description: "Radio",
    props: {
      label: "Radio Label",
      value: "radio1",
      blockDroppingChildrenInside: true,
      ...(props?.props ?? {}),
    },
  };
};
