import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import {
  debouncedTreeComponentStyleUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutGrid } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const initialValues = requiredModifiers.grid;

export const label = "Grid";
export const icon = IconLayoutGrid;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, initialValues, {
          gap: selectedComponent?.props?.style?.gap,
          alignSelf: selectedComponent?.props?.style?.alignSelf,
          gridDirection: selectedComponent?.props?.gridDirection,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <SizeSelector
            label="Gap"
            {...form.getInputProps("gap")}
            onChange={(value) => {
              form.setFieldValue("gap", value as string);
              debouncedTreeComponentStyleUpdate(selectedComponentIds, {
                gap: value as string,
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
              console.log({ value });
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
