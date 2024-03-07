import { SegmentedControlSizes } from "@/components/SegmentedControlSizes";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { inputSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: merge({}, requiredModifiers.checkbox, {
      name: selectedComponent.props?.name,
      size: selectedComponent.props?.size,
      withAsterisk: selectedComponent.props?.withAsterisk,
    }),
  });

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Name"
          size="xs"
          {...form.getInputProps("name")}
          onChange={(e) => {
            form.setFieldValue("name", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  name: e.target.value,
                },
              },
            });
          }}
        />
        <SegmentedControlSizes
          label="Size"
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  size: value,
                },
              },
            });
          }}
        />
        <SwitchSelector
          topLabel="Required"
          checked={form.getInputProps("withAsterisk").value}
          onChange={(event) => {
            form.setFieldValue("withAsterisk", event.currentTarget.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  withAsterisk: event.currentTarget.checked,
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
