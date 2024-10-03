import { Chart } from "@/libs/dnd-flex/components/mapper/charts/Chart";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";

type Props = EditableComponentMapper;

export const PieChart = (props: Props) => {
  const customProps = merge({}, props, {
    component: {
      props: {
        options: {
          fill: {
            type: "gradient",
            opacity: 1,
            gradient: {
              type: "horizontal",
              shadeIntensity: 1,
              opacityFrom: 0.1,
              opacityTo: 1,
              stops: [0, 100],
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: "90%",
                labels: {
                  show: true,
                  name: {
                    show: true,
                  },
                  value: {
                    show: true,
                  },
                  total: {
                    show: true,
                    showAlways: true,
                    label: "Total",
                    fontSize: "22px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 600,
                    color: "#373d3f",
                    formatter: function (w: any) {
                      return w.globals.seriesTotals.reduce(
                        (a: number, b: number) => {
                          return a + b;
                        },
                        0,
                      );
                    },
                  },
                },
              },
            },
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            offsetY: 8,
          },
          stroke: {
            show: true,
          },
          tooltip: {
            fillSeriesColor: false,
          },
        },
      },
    },
  });

  return <Chart {...customProps} />;
};
