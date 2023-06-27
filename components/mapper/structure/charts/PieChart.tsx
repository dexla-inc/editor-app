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
    description: "PieChart Container",
    props: {
      style: {
        marginTop: px(theme.spacing.xl),
        marginBottom: px(theme.spacing.xl),
        marginLeft: px(theme.spacing.xl),
        marginRight: px(theme.spacing.xl),
        width: "100%",
        height: "auto",
        minHeight: "100px",
      },
      ...(props.props || {}),
    },
    children: [
      {
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
      },
    ],
  };
};
