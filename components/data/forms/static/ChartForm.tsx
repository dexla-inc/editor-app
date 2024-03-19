import { Stack, Textarea } from "@mantine/core";
import { scrollbarStyles } from "@/utils/branding";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { requiredModifiers } from "@/utils/modifiers";
import { pick } from "next/dist/lib/pick";
import { safeJsonParse } from "@/utils/common";

const initialValues = requiredModifiers.chart;

export const ChartForm = ({ component }: { component: Component }) => {
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

  return (
    <Stack>
      <Textarea
        autosize
        maxRows={10}
        label={isPieOrRadial ? "Data" : "Data (y-axis)"}
        size="xs"
        styles={{ input: scrollbarStyles }}
        {...form.getInputProps("data")}
        onChange={(e) => {
          form.setFieldValue("data", e.currentTarget.value);
          debouncedTreeComponentAttrsUpdate({
            attrs: {
              props: { series: safeJsonParse(e.currentTarget.value) },
            },
          });
        }}
      />
      <Textarea
        autosize
        maxRows={10}
        label={isPieOrRadial ? "Data Labels" : "Data (x-axis)"}
        size="xs"
        styles={{ input: scrollbarStyles }}
        {...form.getInputProps("dataLabels")}
        onChange={(e) => {
          form.setFieldValue("dataLabels", e.currentTarget.value);
          const options = isPieOrRadial
            ? {
                labels: safeJsonParse(e.currentTarget.value),
              }
            : {
                xaxis: {
                  categories: safeJsonParse(e.currentTarget.value),
                },
              };
          debouncedTreeComponentAttrsUpdate({
            attrs: {
              props: { options },
            },
          });
        }}
      />
    </Stack>
  );
};
