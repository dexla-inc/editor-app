import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";
import { Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const LineChart = (props: Props) => {
  const [initiallyLoading, setInitiallyLoading] = useState(true);

  useEffect(() => {
    setInitiallyLoading(false);
  }, []);

  return (
    <Skeleton visible={initiallyLoading}>
      <Chart {...props} />
    </Skeleton>
  );
};
