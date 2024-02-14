import { Chart } from "@/components/mapper/charts/Chart";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";
import { Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const BarChart = (props: Props) => {
  const [initiallyLoading, setInitiallyLoading] = useState(true);

  useEffect(() => {
    setInitiallyLoading(false);
  }, []);

  const customProps = merge({}, props, {
    component: {
      props: {
        options: {
          legend: {
            position: "top",
            horizontalAlign: "right",
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              columnWidth: "28%",
              borderRadiusApplication: "end",
              borderRadiusWhenStacked: "last",
            },
          },
        },
      },
    },
  });

  return (
    <Skeleton visible={initiallyLoading}>
      <Chart {...customProps} />
    </Skeleton>
  );
};
