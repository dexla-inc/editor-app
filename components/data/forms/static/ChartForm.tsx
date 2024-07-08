import { Component } from "@/utils/editor";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { requiredModifiers } from "@/utils/modifiers";
import { pick } from "next/dist/lib/pick";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { Endpoint } from "@/requests/datasources/types";

const initialValues = requiredModifiers.chart;

export const ChartForm = ({
  component,
  endpoints,
}: {
  component: Component;
  endpoints: Endpoint[] | undefined;
}) => {
  const isPieOrRadial =
    component?.name === "PieChart" || component?.name === "RadialChart";

  const { series, options } = pick(component.props!, ["series", "options"]);
  const _dataLabels = isPieOrRadial
    ? options?.labels
    : options?.xaxis?.categories;

  const form = useForm({
    initialValues: merge({}, initialValues, {
      data: JSON.stringify(series, null, 2),
      dataLabels: JSON.stringify(_dataLabels, null, 2),
    }),
  });
  const specialData = isPieOrRadial
    ? { name: "options.labels", label: "Data Labels" }
    : { name: "options.xaxis.categories", label: "Data (x-axis)" };
  const staticFields = [
    {
      ...specialData,
      fieldType: "Array" as const,
    },
    {
      name: "series",
      label: "Data",
      fieldType: "Array" as const,
    },
  ];

  return (
    <FormFieldsBuilder
      component={component}
      fields={staticFields}
      endpoints={endpoints!}
    />
  );
};
