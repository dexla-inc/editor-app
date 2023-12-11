import { defaultSelectValues } from "@/components/modifiers/Select";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { ...defaultValues } = defaultSelectValues;

  return {
    id: nanoid(),
    name: "Select",
    description: "Select",
    props: {
      style: {
        width: "220px",
      },
      ...defaultValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
