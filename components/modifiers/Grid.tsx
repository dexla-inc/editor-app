import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutGrid } from "@tabler/icons-react";
import merge from "lodash.merge";

export const initialValues = requiredModifiers.grid;

export const label = "Grid";
export const icon = IconLayoutGrid;

export const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
        initialValues: merge({}, initialValues, {
            gap: selectedComponent?.props?.style?.gap,
            alignSelf: selectedComponent?.props?.style?.alignSelf,
        }),
    });

  // gridTemplateColumns: string; // e.g., 'repeat(3, 1fr)' or '200px 1fr 200px'
  // gridTemplateRows?: string; // e.g., 'repeat(2, 100px)' or 'auto'
  // gridColumnGap: string; // e.g., '10px'
  // gridRowGap: string; // e.g., '10px'
  // justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  // alignItems: 'start' | 'end' | 'center' | 'stretch';
  // padding: string;

  return (
    <form>
      <Stack spacing="xs">
        <SizeSelector
          label="Gap"
          {...form.getInputProps("gap")}
          onChange={(value) => {
            form.setFieldValue("gap", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                  style: { gap: value }
              });
          }}
        />
      </Stack>
    </form>
  );
});
