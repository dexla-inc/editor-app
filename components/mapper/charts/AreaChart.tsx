import { Chart } from "@/components/mapper/charts/Chart";
import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { Component } from "@/utils/editor";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const AreaChart = (props: Props) => {
  const { loading } = props.component.props as any;

  if (loading) {
    return <MantineSkeleton height={300} />;
  }

  return <Chart {...props} />;
};
