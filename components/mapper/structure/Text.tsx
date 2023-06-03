import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Text",
    description: "Text",
    children: [],
    props: {
      children: "New text",
      size: "sm",
      w: "auto",
    },
  };
};
