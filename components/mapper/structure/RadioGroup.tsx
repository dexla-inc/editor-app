import { defaultLayoutValues } from "@/components/modifiers/Layout";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const radioGroupId = nanoid();

  return {
    id: radioGroupId,
    name: "RadioGroup",
    description: "Radio Group",
    props: {
      name: radioGroupId,
      style: {
        width: "100%",
        height: "auto",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Radio group Container",
        props: {
          style: {
            ...defaultLayoutValues,
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Radio",
            description: "Radio",
            props: {
              label: "Radio Label 1",
              value: "radio1",
              blockDroppingChildrenInside: true,
              ...(props.props || {}),
            },
          },
          {
            id: nanoid(),
            name: "Radio",
            description: "Radio",
            props: {
              label: "Radio Label 2",
              value: "radio2",
              blockDroppingChildrenInside: true,
              ...(props.props || {}),
            },
          },
        ],
      },
    ],
  };
};
