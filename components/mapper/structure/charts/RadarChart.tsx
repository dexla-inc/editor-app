import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import * as ChartStructure from "@/components/mapper/structure/charts/Chart";
import { theme } from "@/pages/_app";
import { px } from "@mantine/core";

export const jsonStructure = (props?: any): Component => {
  const chartProps = ChartStructure.jsonStructure(props).props;

  return {
    id: nanoid(),
    name: "Container",
    description: "RadarChart Container",
    props: {
      style: {
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
        minHeight: "100px",
        backgroundColor: "white",
      },
    },
    children: [
      {
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
      },
    ],
  };
};
