import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextPlus } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconTextPlus;
export const label = "Textaarea";

export const defaultTextareaValues = {
  placeholder: "Textarea",
  size: "md",
  hideIfDataIsEmpty: false,
  autosize: false,
  withAsterisk: false,
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.text, {
        placeholder: selectedComponent?.props?.placeholder,
        size: selectedComponent?.props?.size,
        autosize: selectedComponent?.props?.style?.autosize,
        withAsterisk: selectedComponent?.props?.withAsterisk,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Placeholder"
            size="xs"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              form.setFieldValue("placeholder", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                placeholder: e.target.value,
              });
            }}
          />
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
            {...form.getInputProps("withAsterisk")}
            onChange={(event) => {
              form.setFieldValue("withAsterisk", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                withAsterisk: event.currentTarget.checked,
              });
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
                debouncedTreeUpdate(selectedComponentIds, {
                  autosize: e.currentTarget.checked,
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
