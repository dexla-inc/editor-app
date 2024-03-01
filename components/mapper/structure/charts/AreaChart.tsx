import * as ChartStructure from "@/components/mapper/structure/charts/Chart";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const chartProps = ChartStructure.jsonStructure(props).props;

  return {
    id: nanoid(),
    name: "AreaChart",
    description: "AreaChart",
    children: [],
    props: {
      ...chartProps,
      type: "area",
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
