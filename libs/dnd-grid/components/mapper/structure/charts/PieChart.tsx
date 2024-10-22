import * as ChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/Chart";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const chartProps = ChartStructure.jsonStructure(props).props;

  return {
    id: nanoid(),
    name: "PieChart",
    description: "PieChart",
    children: [],
    props: {
      ...chartProps,
      type: "donut",
      series: [44, 55, 13],
      options: {
        labels: ["Jan", "Feb", "Mar"],
      },
    },
    blockDroppingChildrenInside: true,
  };
};
