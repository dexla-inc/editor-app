import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";
import { Skeleton } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const AreaChart = (props: Props) => {
  return <Chart {...props} />;
};
