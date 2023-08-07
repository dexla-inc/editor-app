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
      style: {
        width: "100%",
        height: "auto",
        label: "Select a radio",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          label: "Radio Label 1",
          value: "radio1",
          blockDroppingChildrenInside: true,
          ...(props.props || {}),
        },
      },
      {
        id: nanoid(),
        name: "RadioItem",
        description: "Radio Item",
        props: {
          label: "Radio Label 2",
          value: "radio2",
          blockDroppingChildrenInside: true,
          ...(props.props || {}),
        },
      },
    ],
  };
};
