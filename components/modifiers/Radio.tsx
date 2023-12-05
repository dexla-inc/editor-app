import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRadio } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconRadio;
export const label = "Radio";

export const defaultRadioValues = {
  withAsterisk: false,
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultRadioValues, {
        withAsterisk: selectedComponent?.props?.withAsterisk,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <SwitchSelector
            topLabel="Required"
            {...form.getInputProps("withAsterisk")}
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
