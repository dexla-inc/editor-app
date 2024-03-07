import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: merge({}, requiredModifiers.radio, {
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { withAsterisk: event.currentTarget.checked } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
