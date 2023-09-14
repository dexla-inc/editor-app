import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const radioGroupId = nanoid();

  return {
    id: radioGroupId,
    name: "Radio",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      label: "Select a radio",
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          label: "Radio Label 1",
          value: "radio1",
          icon: "",
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          label: "Radio Label 2",
          value: "radio2",
          icon: "",
          ...(props.props || {}),
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
