import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { style, ...rest } = props?.props || {};

  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      ...(rest || {}),
      style: {
        ...defaultLayoutValues,
        width: "100%",
        height: "auto",
        minHeight: "20px",
        ...(style || {}),
      },
    },
  };
};
