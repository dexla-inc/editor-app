import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
import { Skeleton } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const BarChart = (props: Props) => {
  const { loading } = props.component.props as any;

  const customProps = merge({}, props, {
    component: {
      props: {
        options: {
          legend: {
            position: "top",
            horizontalAlign: "right",
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              columnWidth: "28%",
              borderRadiusApplication: "end",
              borderRadiusWhenStacked: "last",
            },
          },
        },
      },
    },
  });

  return <Chart {...customProps} />;
};
