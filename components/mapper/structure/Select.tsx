import { defaultSelectValues } from "@/components/modifiers/Select";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const { labelSize, ...defaultValues } = defaultSelectValues;
  return {
    id: nanoid(),
    name: "Select",
    description: "Select",
    props: {
      style: {
        width: "auto",
        height: "auto",
      },
      labelProps: { size: labelSize },
      ...defaultValues,
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
