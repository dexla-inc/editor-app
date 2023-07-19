import { defaultTheme } from "@/components/IFrame";
import * as ChartStructure from "@/components/mapper/structure/charts/Chart";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const chartProps = ChartStructure.jsonStructure(props).props;
  const { options, ...rest } = props.props || {};

  return {
    id: nanoid(),
    name: "Container",
    description: "AreaChart Container",
    props: {
      style: {
        width: "100%",
        height: "auto",
        minHeight: "100px",
        backgroundColor: "white",
      },
    },
    children: [
      {
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
      },
    ],
  };
};
