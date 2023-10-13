import { Chart } from "@/components/mapper/charts/Chart";
import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { Component } from "@/utils/editor";
import { Props as ApexChartsProps } from "react-apexcharts";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const RadarChart = (props: Props) => {
  const { loading } = props.component.props as any;

  if (loading) {
    return <MantineSkeleton height={300} />;
  }

  return <Chart {...props} type="radar" />;
};
