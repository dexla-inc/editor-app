import { Chart } from "@/libs/dnd-flex/components/mapper/charts/Chart";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";

type Props = EditableComponentMapper;

export const RadarChart = (props: Props) => {
  const theme = useThemeStore((state) => state.theme);

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
