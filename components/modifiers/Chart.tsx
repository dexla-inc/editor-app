import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { ActionIcon, Button, Divider, Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { IconTrash } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useEffect } from "react";

const initialValues = requiredModifiers.chart;

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues,
  });

  const isRadialOnly = selectedComponent?.name === "RadialChart";

  const onClickAddNewColor = () => {
    form.insertListItem("chartColors", "");
  };
  const onClickRemoveColor = async (i: number) => {
    const newChartColors = form.values.chartColors.filter(
      (_: string, index: number) => i !== index,
    );
    form.setFieldValue("chartColors", newChartColors);
    await debouncedTreeComponentAttrsUpdate({
      attrs: {
        props: { chartColors: newChartColors },
      },
    });
  };

  useEffect(() => {
    form.setValues(
      merge({
        chartColors: selectedComponent.props?.chartColors as string[],
        labelColor: selectedComponent.props?.labelColor,
        foreColor: selectedComponent.props?.foreColor,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

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
          <Flex justify="space-between">
            <Text fw={500} size="xs">
              Chart Colors
            </Text>

            <Button variant="default" size="xs" onClick={onClickAddNewColor}>
              + Add
            </Button>
          </Flex>

          <Stack spacing="xs">
            {form.values.chartColors.map((color: string, index: number) => (
              <Flex key={index}>
                <ThemeColorSelector
                  value={color}
                  onChange={(e) => {
                    const newChartColors = form.values.chartColors;
                    newChartColors[index] = e;
                    form.setFieldValue(`chartColors`, newChartColors);

                    debouncedTreeComponentAttrsUpdate({
                      attrs: {
                        props: { chartColors: newChartColors },
                      },
                    });
                  }}
                />
                <ActionIcon onClick={() => onClickRemoveColor(index)}>
                  <IconTrash size={ICON_SIZE} color="red" />
                </ActionIcon>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
});

export default Modifier;
