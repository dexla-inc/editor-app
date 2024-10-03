import { Chart } from "@/libs/dnd-flex/components/mapper/charts/Chart";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";

type Props = EditableComponentMapper;

export const BarChart = (props: Props) => {
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

  return <Chart {...customProps} />;
};
