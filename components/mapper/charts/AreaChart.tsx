import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";
import { Skeleton } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const AreaChart = (props: Props) => {
  const { loading } = props.component.props as any;

  return (
    <Skeleton visible={loading}>
      <Chart {...props} />
    </Skeleton>
  );
};
