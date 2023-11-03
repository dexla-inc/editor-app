import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextPlus } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconTextPlus;
export const label = "Textaarea";

export const defaultTextareaValues = {
  placeholder: "Textarea",
  size: "md",
  hideIfDataIsEmpty: false,
  autosize: false,
  withAsterisk: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.text },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "placeholder",
        "style",
        "size",
        "withAsterisk",
      ]);

      form.setValues({
        placeholder: data.placeholder ?? defaultTextareaValues.placeholder,
        size: data.size ?? defaultTextareaValues.size,
        autosize: data.style.autosize ?? defaultTextareaValues.autosize,
        withAsterisk: data.withAsterisk ?? defaultTextareaValues.withAsterisk,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedTreeComponentPropsUpdate("placeholder", e.target.value);
          }}
        />
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
        <Stack spacing={2}>
          <Text size="xs" fw={500}>
            Autosize
          </Text>
          <Switch
            {...form.getInputProps("autosize")}
            size="xs"
            onChange={(e) => {
              form.setFieldValue(
                "autosize",
                e.currentTarget.checked as boolean,
              );
              debouncedTreeComponentPropsUpdate(
                "autosize",
                e.currentTarget.checked,
              );
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
});
