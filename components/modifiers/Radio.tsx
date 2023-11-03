import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRadio } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconRadio;
export const label = "Radio";

export const defaultRadioValues = {
  withAsterisk: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultRadioValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["withAsterisk"]);

      form.setValues({
        withAsterisk: data.withAsterisk ?? defaultRadioValues.withAsterisk,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <SwitchSelector
          topLabel="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(event) => {
            form.setFieldValue("withAsterisk", event.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "withAsterisk",
              event.currentTarget.checked,
            );
          }}
        />
      </Stack>
    </form>
  );
});
