import { Component } from "@/utils/editor";
import { Props as ApexChartsProps } from "react-apexcharts";
import { Chart } from "@/components/mapper/charts/Chart";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const PieChart = (props: Props) => {
  return <Chart {...props} type="pie" />;
};
