import { Chart } from "@/components/mapper/charts/Chart";
import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
};

export const PieChart = (props: Props) => {
  const { loading } = props.component.props as any;

  if (loading) {
    return <MantineSkeleton circle height={300} />;
  }

  const customProps = merge({}, props, {
    component: {
      props: {
        options: {
          dataLabels: {
            enabled: true,
            dropShadow: {
              enabled: false,
            },
          },
          labels: {
            show: true,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
          stroke: {
            show: false,
          },
          tooltip: {
            fillSeriesColor: false,
          },
        },
      },
    },
  });

  return <Chart {...customProps} />;
};
