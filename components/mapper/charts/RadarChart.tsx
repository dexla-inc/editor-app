import { Chart } from "@/components/mapper/charts/Chart";
import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const RadarChart = (props: Props) => {
  const { loading } = props.component.props as any;
  const theme = useEditorStore((state) => state.theme);

  if (loading) {
    return <MantineSkeleton height={300} />;
  }

  const customProps = merge({}, props, {
    component: {
      props: {
        options: {
          fill: {
            opacity: 0.4,
          },
          stroke: {
            width: 2,
          },
          polygons: {
            fill: { colors: ["transparent"] },
            strokeColors: theme.fn.lighten(theme.colors.gray[5], 0.2),
            connectorColors: theme.fn.lighten(theme.colors.gray[5], 0.2),
          },
        },
      },
    },
  });

  return <Chart {...customProps} />;
};
