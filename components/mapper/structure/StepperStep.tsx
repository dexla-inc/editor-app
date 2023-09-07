import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "StepperStep",
    description: "Step",
    props: {
      label: "Step label",
      description: "Step description",
      ...(props.props || {}),
    },
    children: [],
  };
};
