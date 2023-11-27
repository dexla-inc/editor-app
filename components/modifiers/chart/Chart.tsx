import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Divider, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChartInfographic } from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const label = "Chart";
export const icon = IconChartInfographic;

const initialValues = requiredModifiers.chart;

export const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useEditorStore((state) => state.theme);
  const form = useForm({
    initialValues,
  });

  const isPieOrRadial =
    selectedComponent?.name === "PieChart" ||
    selectedComponent?.name === "RadialChart";

  useEffect(() => {
    if (selectedComponent?.id) {
      const { series, options } = pick(selectedComponent.props!, [
        "series",
        "options",
      ]);
      const _dataLabels = isPieOrRadial
        ? options?.labels
        : options?.xaxis?.categories;
      form.setValues(
        merge({}, initialValues, {
          data: JSON.stringify(series, null, 2),
          dataLabels: JSON.stringify(_dataLabels, null, 2),
          colors: options?.colors ?? [
            "Success.7",
            theme.colors.orange[4],
            theme.colors.blue[4],
            theme.colors.red[6],
            theme.colors.green[4],
            theme.colors.orange[9],
            theme.colors.green[9],
            theme.colors.blue[8],
            theme.colors.blue[9],
          ],
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  console.log(form.values.colors);

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
            {form.values.colors.map((color: string, index: number) => (
              <ThemeColorSelector
                key={index}
                value={color}
                onChange={(e) => {
                  const colors = [...form.values.colors];
                  colors[index] = e;
                  form.setFieldValue("colors", colors);
                  try {
                    debouncedTreeComponentPropsUpdate("options", {
                      colors,
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
