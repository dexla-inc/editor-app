import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "RadioItem",
    description: "Radio",
    props: {
      label: "Radio Item",
      value: "radio1",
      ...(props?.props ?? {}),
    },
    blockDroppingChildrenInside: true,
  };
};
