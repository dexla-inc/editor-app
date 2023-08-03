import * as ChartStructure from "@/components/mapper/structure/charts/Chart";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const chartProps = ChartStructure.jsonStructure(props).props;
  const { options, ...rest } = props.props || {};

  return {
    id: nanoid(),
    name: "AreaChart",
    description: "AreaChart",
    children: [],
    props: {
      ...chartProps,
      type: "area",
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
        ...(options || {}),
      },
      ...(rest || {}),
    },
    blockDroppingChildrenInside: true,
  };
};
