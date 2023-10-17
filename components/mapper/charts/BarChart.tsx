import { Chart } from "@/components/mapper/charts/Chart";
import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
};

export const BarChart = (props: Props) => {
  const { loading } = props.component.props as any;

  if (loading) {
    return <MantineSkeleton height={300} />;
  }

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
