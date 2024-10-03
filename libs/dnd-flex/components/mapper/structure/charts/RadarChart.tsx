import * as ChartStructure from "@/libs/dnd-flex/components/mapper/structure/charts/Chart";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
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
