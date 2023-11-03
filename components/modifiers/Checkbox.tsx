import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheckbox } from "@tabler/icons-react";
import { useEffect } from "react";
import { pick } from "next/dist/lib/pick";
import { withModifier } from "@/hoc/withModifier";

export const icon = IconCheckbox;
export const label = "Checkbox";

export const defaultInputValues = {
  name: "Checkbox",
  size: "sm",
  withAsterisk: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "name",
        "size",
        "withAsterisk",
      ]);

      form.setValues({
        name: data.name ?? defaultInputValues.name,
        size: data.size ?? defaultInputValues.size,
        withAsterisk: data.withAsterisk ?? defaultInputValues.withAsterisk,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Name"
          size="xs"
          {...form.getInputProps("name")}
          onChange={(e) => {
            form.setFieldValue("name", e.target.value);
            debouncedTreeComponentPropsUpdate("name", e.target.value);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
          }}
        />
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
