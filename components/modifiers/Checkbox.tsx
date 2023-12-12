import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheckbox } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconCheckbox;
export const label = "Checkbox";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
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
              debouncedTreeUpdate(selectedComponentIds, {
                name: e.target.value,
              });
            }}
          />
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
              });
            }}
          />
          <SwitchSelector
            topLabel="Required"
            checked={form.getInputProps("withAsterisk").value}
            onChange={(event) => {
              form.setFieldValue("withAsterisk", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                withAsterisk: event.currentTarget.checked,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
