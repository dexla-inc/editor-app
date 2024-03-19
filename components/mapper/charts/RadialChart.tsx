import { Chart, getChartColor } from "@/components/mapper/charts/Chart";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";

type Props = EditableComponentMapper;

export const RadialChart = (props: Props) => {
  const { labelColor } = props.component.props as any;
  const theme = useThemeStore((state) => state.theme);
  const _labelColor = getChartColor(theme, labelColor, "SecondaryText.5");

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
                  color: _labelColor,
                },
                value: {
                  offsetY: -35,
                  fontSize: theme.fontSizes.xl,
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  color: _labelColor,
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

  return <Chart {...customProps} />;
};
