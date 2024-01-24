import { Component } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "Chart",
    description: "Chart",
    children: [],
    props: {
      dataType: "static",
      type: "line",
      height: "auto",
      style: {
        width: "fit-content",
        height: "fit-content",
      },
      chartColors: [...requiredModifiers.chart.colors],
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
