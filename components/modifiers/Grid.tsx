import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
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
        <SizeSelector
          label="Gap"
          {...form.getInputProps("gap")}
          onChange={(value) => {
            form.setFieldValue("gap", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: { gap: value },
              },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { gridDirection: value as string } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
