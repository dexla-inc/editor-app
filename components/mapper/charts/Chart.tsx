import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { MantineThemeExtended } from "@/types/types";
import { ApexOptions } from "apexcharts";
import get from "lodash.get";
import merge from "lodash.merge";
import dynamic from "next/dynamic";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import groupBy from "lodash.groupby";
import { Box, Skeleton } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo, useMemo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { safeJsonParse } from "@/utils/common";

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

const defaultColors = (theme: MantineThemeExtended) => [
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

const baseOptions: ApexOptions = {
  chart: {
    toolbar: { show: false },
    width: "100%",
    offsetX: 0,
    offsetY: 0,
  },
  states: {
    hover: { filter: { type: "lighten", value: 0.04 } },
    active: { filter: { type: "darken", value: 0.88 } },
  },
  stroke: {
    width: 3,
    curve: "smooth",
    lineCap: "round",
  },
  grid: {
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
  },
  markers: { size: 0 },
  legend: {
    fontSize: "13px",
    position: "top",
    horizontalAlign: "right",
    markers: { radius: 12 },
    fontWeight: 500,
    itemMargin: { horizontal: 8 },
    onItemClick: { toggleDataSeries: true },
  },
  tooltip: {
    x: { show: true },
    marker: { show: true },
  },
  dataLabels: { enabled: false },
};

const ChartComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const mergedProps = merge({}, component.props, component.onLoad);

    const {
      children,
      series,
      type,
      options,
      chartColors,
      labelColor,
      foreColor,
      triggers,
      dataType = "static",
      ...componentProps
    } = mergedProps;

    const theme = useThemeStore((state) => state.theme);
    const isPieOrRadial =
      component?.name === "PieChart" || component?.name === "RadialChart";

    const colors = useMemo(
      () =>
        chartColors?.map((color: any) => getColorFromTheme(theme, color)) ??
        defaultColors(theme),
      [chartColors, theme],
    );

    const _labelColor = useMemo(
      () => getChartColor(theme, labelColor, "SecondaryText.5"),
      [theme, labelColor],
    );
    const _foreColor = useMemo(
      () => getChartColor(theme, foreColor, "Secondary.5"),
      [theme, foreColor],
    );

    const { data: response, isLoading } = useEndpoint({
      componentId: component.id!,
      onLoad: component.onLoad,
      dataType,
    });

    let dataSeries = series;
    let dynamicOptions = {};

    if (dataType === "dynamic") {
      dataSeries = [];

      if (response) {
        // TODO: implement it back when the swagger is ready
        // const grouped = groupBy(get(response, resultsKey, {}), dataLegendKey);
        const grouped = groupBy(get(response, "data", []), "description");
        if (isPieOrRadial) {
          dataSeries = get(response, "data", []).map((i: any) => i.value);
        } else {
          dataSeries = Object.entries(grouped).map(([name, items]) => ({
            name,
            data: items.map((i: any) => i.value),
          }));
        }

        const dataLabels = get(response, "data", []).map(
          (i: any) => i.selector,
        );

        dynamicOptions = {
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
      }
    }

    try {
      const customOptions = useMemo(
        () =>
          merge(
            {},
            baseOptions,
            {
              colors,
              chart: { ...baseOptions.chart, foreColor: _foreColor },
              grid: {
                ...baseOptions.grid,
                borderColor: theme.fn.lighten(_foreColor, 0.2),
              },
              markers: {
                ...baseOptions.markers,
                strokeColors: theme.colors.gray[0],
              },
              legend: {
                ...baseOptions.legend,
                show:
                  type !== "radialBar" && safeJsonParse(dataSeries)?.length > 0,
                labels: { colors: _labelColor },
              },
            },
            {
              xaxis: {
                categories: safeJsonParse(get(options, "xaxis.categories", "")),
              },
              labels: safeJsonParse(options?.labels) ?? [],
            },
            dynamicOptions,
          ),
        [
          colors,
          _foreColor,
          _labelColor,
          options,
          dynamicOptions,
          theme,
          type,
          dataSeries,
        ],
      );

      Object.assign(customOptions, dynamicOptions);
      console.log(customOptions);
      return (
        <Skeleton visible={isLoading} id={component.id}>
          <Box
            ref={ref}
            component={ReactApexChart}
            {...omit(props, ["id"])}
            {...componentProps}
            {...triggers}
            series={safeJsonParse(dataSeries)}
            style={{
              ...(props.style ?? {}),
              textAlign: "center",
              padding: 0,
              color: theme.colors.gray[8],
            }}
            type={type}
            options={customOptions}
            width={componentProps.style?.width ?? "100%"}
            height={componentProps.style?.height ?? 320}
          />
        </Skeleton>
      );
    } catch {
      return (
        <Skeleton visible={isLoading} id={component.id}>
          <Box ref={ref} />
        </Skeleton>
      );
    }
  },
);

ChartComponent.displayName = "Chart";

export const Chart = memo(withComponentWrapper<Props>(ChartComponent));
