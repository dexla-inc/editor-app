import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { scrollbarStyles } from "@/utils/branding";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
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

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const [length, setLength] = useState(0);

    const isPieOrRadial =
      selectedComponent?.name === "PieChart" ||
      selectedComponent?.name === "RadialChart";

    const { series, options, chartColors, labelColor, foreColor } = pick(
      selectedComponent.props!,
      ["series", "options", "chartColors", "labelColor", "foreColor"],
    );
    const _dataLabels = isPieOrRadial
      ? options?.labels
      : options?.xaxis?.categories;

    const form = useForm({
      initialValues: merge({}, initialValues, {
        data: JSON.stringify(series, null, 2),
        dataLabels: JSON.stringify(_dataLabels, null, 2),
        colors: chartColors,
        labelColor,
        foreColor,
      }),
    });

    const isRadialOnly = selectedComponent?.name === "RadialChart";

    useEffect(() => {
      setLength(series?.length ?? 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [series?.length]);

    return (
      <form>
        <Stack spacing="xs">
          <ThemeColorSelector
            label="Label Color"
            {...form.getInputProps("labelColor")}
            onChange={(e) => {
              form.setFieldValue("labelColor", e);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { labelColor: e } },
              });
            }}
          />
          {!isRadialOnly && (
            <ThemeColorSelector
              label="Axis Labels Color"
              {...form.getInputProps("foreColor")}
              onChange={(e) => {
                form.setFieldValue("foreColor", e);
                debouncedTreeComponentAttrsUpdate({
                  attrs: { props: { foreColor: e } },
                });
              }}
            />
          )}
          <Textarea
            autosize
            maxRows={10}
            label={isPieOrRadial ? "Data" : "Data (y-axis)"}
            size="xs"
            styles={{ input: scrollbarStyles }}
            {...form.getInputProps("data")}
            onChange={(e) => {
              form.setFieldValue("data", e.currentTarget.value);
              try {
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: { series: JSON.parse(e.currentTarget.value ?? "") },
                  },
                });
              } catch (error) {
                console.error(error);
              }
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
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: { options },
                  },
                });
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
                        debouncedTreeComponentAttrsUpdate({
                          attrs: {
                            props: { chartColors: colors },
                          },
                        });
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
  },
);
