import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Divider, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";

const initialValues = requiredModifiers.chart;

const Modifier = withModifier(({ selectedComponent }) => {
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
        <Divider variant="dotted" />
        <Stack>
          <Text fw={500} size="xs">
            Chart Colors
          </Text>
          <Stack spacing="xs">
            {form.values.colors
              .slice(0, series?.length ?? 0)
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
});

export default Modifier;
