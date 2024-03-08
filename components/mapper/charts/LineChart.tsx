import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";

type Props = {
  component: Component;
};

export const LineChart = (props: Props) => {
  return <Chart {...props} />;
};
