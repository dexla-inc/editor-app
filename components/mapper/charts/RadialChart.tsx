import { Chart } from "@/components/mapper/charts/Chart";
import { MantineSkeleton } from "@/components/skeleton/Skeleton";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const RadialChart = (props: Props) => {
  const { loading } = props.component.props as any;
  const theme = useEditorStore((state) => state.theme);

  const customProps = merge({}, props, {
    component: {
      props: {
        options: {
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              shadeIntensity: 0.5,
              gradientToColors: ["#ABE5A1"],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100],
            },
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              hollow: { size: "73%" },
              track: {
                background: "#e7e7e7",
                strokeWidth: "97%",
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  opacity: 0.31,
                  blur: 2,
                },
              },
              dataLabels: {
                name: {
                  show: true,
                  offsetY: 10,
                },
                value: {
                  offsetY: -35,
                  fontSize: theme.fontSizes.xl,
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  color: "#373d3f",
                },
              },
            },
          },
          stroke: {
            lineCap: "round",
          },
        },
        style: {
          margin: 0,
          padding: 0,
        },
      },
    },
  });

  if (loading) {
    return <MantineSkeleton circle height={300} />;
  }
  return <Chart {...customProps} />;
};
