import { withModifier } from "@/hoc/withModifier";
import { gapSizes } from "@/utils/defaultSizes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutGrid } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlSizes } from "../SegmentedControlSizes";

export const label = "Grid";
export const icon = IconLayoutGrid;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.grid, {
          gap: selectedComponent?.props?.gap,
          alignSelf: selectedComponent?.props?.style?.alignSelf,
          gridDirection: selectedComponent?.props?.gridDirection,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <SegmentedControlSizes
            label="Gap"
            sizing={gapSizes}
            includeZero
            {...form.getInputProps("gap")}
            onChange={(value) => {
              form.setFieldValue("gap", value);
              debouncedTreeUpdate(selectedComponentIds, {
                gap: value,
              });
            }}
          />
          <Select
            label="Direction"
            data={[
              {
                label: "Column",
                value: "column",
              },
              {
                label: "Row",
                value: "row",
              },
            ]}
            size="xs"
            {...form.getInputProps("gridDirection")}
            onChange={(value) => {
              form.setFieldValue("gridDirection", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                gridDirection: value as string,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
