import { Component } from "@/utils/editor";
import { Props as ApexChartsProps } from "react-apexcharts";
import { Chart } from "@/components/mapper/charts/Chart";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const RadarChart = (props: Props) => {
  return <Chart {...props} type="radar" />;
};
