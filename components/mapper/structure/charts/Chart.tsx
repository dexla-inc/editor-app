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
      ],
      options: {
        chart: {
          toolbar: {
            show: false,
          },
          width: "100%",
        },
        dataLabels: {
          enabled: false,
        },
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
