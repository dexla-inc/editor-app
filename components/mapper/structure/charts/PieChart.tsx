import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import * as ChartStructure from "@/components/mapper/structure/charts/Chart";

export const jsonStructure = (props?: any): Component => {
  const chartProps = ChartStructure.jsonStructure(props).props;

  return {
    id: nanoid(),
    name: "PieChart",
    description: "PieChart",
    children: [],
    props: {
      ...chartProps,
      type: "pie",
      series: [44, 55, 13, 43, 22],
      options: {
        ...chartProps?.options,
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      },
    },
    blockDroppingChildrenInside: true,
  };
};
