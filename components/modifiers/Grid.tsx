import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentStyleUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutGrid } from "@tabler/icons-react";
import merge from "lodash.merge";

export const initialValues = requiredModifiers.grid;

export const label = "Grid";
export const icon = IconLayoutGrid;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, initialValues, {
        gap: selectedComponent?.props?.style?.gap,
        alignSelf: selectedComponent?.props?.style?.alignSelf,
      }),
    });

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
        </Stack>
      </form>
    );
  },
);
