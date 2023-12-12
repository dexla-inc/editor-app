import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRadio } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconRadio;
export const label = "Radio";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.radioItem, {
        value: selectedComponent?.props?.value,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                value: e.target.value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
