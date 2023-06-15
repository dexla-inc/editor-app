import { Component } from "@/utils/editor";
import { Props as ApexChartsProps } from "react-apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ApexChartsProps;

export const Chart = ({ renderTree, component, ...props }: Props) => {
  const { children, style, ...componentProps } = component.props as any;

  return (
    <ReactApexChart
      {...props}
      {...componentProps}
      style={{ ...style, width: "100%" }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </ReactApexChart>
  );
};
