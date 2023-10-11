import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import get from "lodash.get";
import dynamic from "next/dynamic";
import { Props as ApexChartsProps } from "react-apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const Chart = ({ renderTree, component, ...props }: Props) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const {
    children,
    style,
    data,
    repeatedIndex,
    series,
    type,
    options,
    ...componentProps
  } = component.props as any;

  const isPie = type === "pie";

  let dataSeries = series;
  let dataLabels = isPie ? options?.labels : options?.xaxis?.categories;
  if (isPreviewMode) {
    dataSeries = data?.series?.value ?? series;
    dataLabels = data?.labels?.value ?? dataLabels;
  }

  if (
    isPreviewMode &&
    typeof repeatedIndex !== "undefined" &&
    data?.series?.path
  ) {
    const path = data?.series?.path.replace("[0]", `[${repeatedIndex}]`);
    dataSeries = get(data?.series?.base ?? {}, path) ?? series;
  }

  if (
    isPreviewMode &&
    typeof repeatedIndex !== "undefined" &&
    data?.labels?.path
  ) {
    const path = data?.dataLabels?.path.replace("[0]", `[${repeatedIndex}]`);
    dataLabels = get(data?.dataLabels?.base ?? {}, path) ?? dataLabels;
  }

  const opts = {
    ...options,
    ...(isPie ? { labels: dataLabels } : { xaxis: { categories: dataLabels } }),
  };

  return (
    <ReactApexChart
      {...props}
      {...componentProps}
      series={dataSeries}
      style={...style}
      width="100%"
      type={type}
      options={opts}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </ReactApexChart>
  );
};
