import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutGrid } from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

const initialValues = requiredModifiers.grid;

export const label = "Grid";
export const icon = IconLayoutGrid;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({ initialValues });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { gap } = pick(selectedComponent.props!, ["gap"]);

      const { alignSelf } = pick(selectedComponent.props!.style, ["alignSelf"]);
      form.setValues(merge({}, initialValues, { gap, alignSelf }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

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
            debouncedTreeComponentPropsUpdate("gap", value as string);
          }}
        />
      </Stack>
    </form>
  );
});
