import * as ChartStructure from "@/components/mapper/structure/charts/Chart";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const chartProps = ChartStructure.jsonStructure(props).props;

  return {
    id: nanoid(),
    name: "RadialChart",
    description: "RadialChart",
    children: [],
    props: {
      ...chartProps,
      type: "radialBar",
      series: [76],
      options: {
        labels: ["Progress"],
      },
    },
    blockDroppingChildrenInside: true,
  };
};
