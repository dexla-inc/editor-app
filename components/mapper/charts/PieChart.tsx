import { Component } from "@/utils/editor";
import { Props as ApexChartsProps } from "react-apexcharts";
import { Chart } from "@/components/mapper/charts/Chart";
import { PieChart as Skeleton } from "../skeleton/Skeleton";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const PieChart = (props: Props) => {
  const loading = true;
  if (loading) {
    return <Skeleton width="100%" height={500} />;
  }
  return <Chart {...props} type="pie" />;
};
