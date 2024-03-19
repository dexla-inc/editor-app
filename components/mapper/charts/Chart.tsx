import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { MantineThemeExtended } from "@/utils/types";
import { ApexOptions } from "apexcharts";
import get from "lodash.get";
import merge from "lodash.merge";
import dynamic from "next/dynamic";
import { useEndpoint } from "@/hooks/useEndpoint";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = EditableComponentMapper;

export const getChartColor = (
  theme: MantineThemeExtended,
  color: string,
  altColor: string,
) =>
  color ? getColorFromTheme(theme, color) : getColorFromTheme(theme, altColor);

export const Chart = ({ component, ...props }: Props) => {
  const {
    children,
    data,
    repeatedIndex,
    series,
    type,
    options,
    chartColors,
    labelColor,
    foreColor,
    triggers,
    dataType,

    ...componentProps
  } = component.props as any;

  const theme = useThemeStore((state) => state.theme);
  const isPieOrRadial =
    component?.name === "PieChart" || component?.name === "RadialChart";

  const colors = chartColors?.map((color: any) =>
    getColorFromTheme(theme, color),
  ) ?? [
    theme.colors.green[7],
    theme.colors.orange[4],
    theme.colors.blue[4],
    theme.colors.red[6],
    theme.colors.green[4],
    theme.colors.orange[9],
    theme.colors.green[9],
    theme.colors.blue[8],
    theme.colors.blue[9],
  ];

  const _labelColor = getChartColor(theme, labelColor, "SecondaryText.5");
  const _foreColor = getChartColor(theme, foreColor, "Secondary.5");

  const customOptions: ApexOptions = merge(
    {},
    {
      colors,
      chart: {
        toolbar: {
          show: false,
        },
        width: "100%",
        foreColor: _foreColor,
        offsetX: 0,
        offsetY: 0,
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.04,
          },
        },
        active: {
          filter: {
            type: "darken",
            value: 0.88,
          },
        },
      },
      stroke: {
        width: 3,
        curve: "smooth",
        lineCap: "round",
      },
      grid: {
        strokeDashArray: 3,
        borderColor: theme.fn.lighten(_foreColor, 0.2),
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      markers: {
        size: 0,
        strokeColors: theme.colors.gray[0],
      },
      legend: {
        show: type !== "radialBar" && series?.length > 0,
        fontSize: 13,
        position: "top",
        horizontalAlign: "right",
        markers: {
          radius: 12,
        },
        fontWeight: 500,
        itemMargin: {
          horizontal: 8,
        },
        labels: {
          colors: _labelColor,
        },
        legend: {
          onItemClick: {
            toggleDataSeries: true,
          },
        },
      },
      tooltip: {
        x: {
          show: true,
        },
        marker: {
          show: series?.length > 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    options,
  );

  const { data: response } = useEndpoint({
    component,
  });

  let dataSeries = [],
    dataLabels = [];

  if (dataType === "static") {
    dataSeries = series;
    dataLabels = isPieOrRadial ? options?.labels : options?.xaxis?.categories;
  } else if (dataType === "dynamic") {
  }

  const opts = {
    ...customOptions,
    ...(isPieOrRadial
      ? { labels: dataLabels }
      : {
          xaxis: {
            categories: dataLabels,
            labels: {
              style: { colors: dataLabels?.map((_: any) => _foreColor) },
            },
          },
        }),
  };

  return (
    <ReactApexChart
      {...props}
      {...componentProps}
      {...triggers}
      series={dataSeries}
      style={{
        ...(props.style ?? {}),
        textAlign: "center",
        padding: 0,
        color: theme.colors.gray[8],
      }}
      width="100%"
      type={type}
      options={opts}
    />
  );
};
