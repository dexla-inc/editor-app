import { MantineThemeExtended, useEditorStore } from "@/stores/editor";
import { Component, getColorFromTheme } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { ApexOptions } from "apexcharts";
import get from "lodash.get";
import merge from "lodash.merge";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  component: Component;
  isPreviewMode?: boolean;
} & BoxProps;

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
    ...componentProps
  } = component.props as any;

  const theme = useEditorStore((state) => state.theme);
  const isPieOrRadial =
    type === "pie" || type === "donut" || type === "radialBar";

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
        show: type !== "radialBar" && series.length > 0,
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
          show: series.length > 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    options,
  );

  let dataSeries = series;
  let dataLabels = isPieOrRadial ? options?.labels : options?.xaxis?.categories;

  if (props.isPreviewMode) {
    dataSeries = data?.series?.value ?? series;
    dataLabels = data?.labels?.value ?? dataLabels;

    if (typeof repeatedIndex !== "undefined") {
      if (data?.series?.path) {
        const path = data?.series?.path.replace("[0]", `[${repeatedIndex}]`);
        dataSeries = get(data?.series?.base, path, series);
      }

      if (data?.labels?.path) {
        const path = data?.dataLabels?.path.replace(
          "[0]",
          `[${repeatedIndex}]`,
        );
        dataLabels = get(data?.dataLabels?.base, path, dataLabels);
      }
    }
  }

  const opts = {
    ...customOptions,
    ...(isPieOrRadial
      ? { labels: dataLabels }
      : {
          xaxis: {
            categories: dataLabels,
            labels: {
              style: { colors: dataLabels.map((_: any) => _foreColor) },
            },
          },
        }),
  };

  return (
    <div>
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
    </div>
  );
};
