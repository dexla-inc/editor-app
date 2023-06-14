import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import * as ChartStructure from "@/components/mapper/structure/charts/Chart";

export const jsonStructure = (props?: any): Component => {
  const chartProps = ChartStructure.jsonStructure(props).props;

  return {
    id: nanoid(),
    name: "RadarChart",
    description: "RadarChart",
    children: [],
    props: {
      ...chartProps,
      type: "radar",
      options: {
        ...chartProps?.options,
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
          ],
        },
      },
    },
    blockDroppingChildrenInside: true,
  };
};
