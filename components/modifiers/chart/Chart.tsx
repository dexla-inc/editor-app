import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Divider, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChartInfographic } from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect, useState } from "react";

export const label = "Chart";
export const icon = IconChartInfographic;

const initialValues = requiredModifiers.chart;

export const Modifier = withModifier(({ selectedComponent }) => {
  const [length, setLength] = useState(0);
  const form = useForm({
    initialValues,
  });

  const isPieOrRadial =
    selectedComponent?.name === "PieChart" ||
    selectedComponent?.name === "RadialChart";

  useEffect(() => {
    if (selectedComponent?.id) {
      const { series, options, chartColors } = pick(selectedComponent.props!, [
        "series",
        "options",
        "chartColors",
      ]);
      const _dataLabels = isPieOrRadial
        ? options?.labels
        : options?.xaxis?.categories;
      setLength(series?.length ?? 0);
      form.setValues(
        merge({}, initialValues, {
          data: JSON.stringify(series, null, 2),
          dataLabels: JSON.stringify(_dataLabels, null, 2),
          colors: chartColors,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <Textarea
          autosize
          label={isPieOrRadial ? "Data" : "Data (y-axis)"}
          size="xs"
          {...form.getInputProps("data")}
          onChange={(e) => {
            form.setFieldValue("data", e.currentTarget.value);
            try {
              debouncedTreeComponentPropsUpdate(
                "series",
                JSON.parse(e.currentTarget.value ?? ""),
              );
            } catch (error) {
              console.error(error);
            }
          }}
        />
        <Textarea
          autosize
          label={isPieOrRadial ? "Data Labels" : "Data (x-axis)"}
          size="xs"
          {...form.getInputProps("dataLabels")}
          onChange={(e) => {
            form.setFieldValue("dataLabels", e.currentTarget.value);
            try {
              const options = isPieOrRadial
                ? {
                    labels: JSON.parse(e.currentTarget.value ?? ""),
                  }
                : {
                    xaxis: {
                      categories: JSON.parse(e.currentTarget.value ?? ""),
                    },
                  };
              debouncedTreeComponentPropsUpdate("options", options);
            } catch (error) {
              console.error(error);
            }
          }}
        />
        <Divider variant="dotted" />
        <Stack>
          <Text fw={500} size="xs">
            Chart Colors
          </Text>
          <Stack spacing="xs">
            {form.values.colors
              .slice(0, length)
              .map((color: string, index: number) => (
                <ThemeColorSelector
                  key={index}
                  value={color}
                  onChange={(e) => {
                    const colors = [...form.values.colors];
                    colors[index] = e;
                    form.setFieldValue("colors", colors);
                    try {
                      debouncedTreeComponentPropsUpdate("chartColors", colors);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                />
              ))}
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
});
