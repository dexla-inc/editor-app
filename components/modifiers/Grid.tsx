import { withModifier } from "@/hoc/withModifier";
import { gapSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { SegmentedControlSizes } from "../SegmentedControlSizes";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: merge({}, requiredModifiers.grid, {
      gap: selectedComponent?.props?.gap,
      alignSelf: selectedComponent?.props?.style?.alignSelf,
      gridDirection: selectedComponent?.props?.gridDirection,
    }),
  });

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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { gap: value } },
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
