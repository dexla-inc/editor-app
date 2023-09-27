import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";
import { Props as ApexChartsProps } from "react-apexcharts";
import { MantineSkeleton } from "../skeleton/Skeleton";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const PieChart = (props: Props) => {
  const { loading } = props.component.props as any;
  const isLoading = loading ?? false;

  if (isLoading) {
    return <MantineSkeleton circle height={300} />;
  }

  return <Chart {...props} type="pie" />;
};
