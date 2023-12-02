import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutColumns } from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

const initialValues = requiredModifiers.grid;

export const label = "Grid";
export const icon = IconLayoutColumns;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({ initialValues });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { gap } = pick(selectedComponent.props!, ["gap"]);
      form.setValues(merge({}, initialValues, { gap }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <SizeSelector
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
