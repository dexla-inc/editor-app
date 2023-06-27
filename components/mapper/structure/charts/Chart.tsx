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
      height: "350px",
      style: {
        height: "350px",
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
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: "Product Trends by Month",
          align: "left",
        },
      },
      ...(props.props || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
