import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Chart",
    description: "Chart",
    children: [],
    props: {
      type: "line",
      height: "auto",
      style: {
        height: "auto",
        width: "100%",
      },
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
        {
          name: "Tablets",
          data: [73, 29, 108, 52, 97, 18, 126, 85, 11],
        },
        {
          name: "Smartphones",
          data: [63, 41, 134, 5, 38, 117, 77, 22, 91],
        },
      ],
      options: {},
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
