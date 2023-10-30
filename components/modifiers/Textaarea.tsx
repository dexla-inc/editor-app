import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Flex, Select, Stack, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconTextSize;
export const label = "Textaarea";

export const defaultTextareaValues = {
  value: "New Text",
  size: "md",
  weight: "normal",
  color: "Black.6",
  lineHeight: "",
  letterSpacing: "",
  align: "left",
  hideIfDataIsEmpty: false,
  autosize: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.text },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "children",
        "style",
        "color",
        "size",
        "weight",
        "hideIfDataIsEmpty",
      ]);

      form.setValues({
        value: data.children ?? defaultTextareaValues.value,
        color: data.color ?? defaultTextareaValues.color,
        size: data.size ?? defaultTextareaValues.size,
        weight: data.weight ?? defaultTextareaValues.weight,
        align: data.style.textAlign ?? defaultTextareaValues.align,
        autosize: data.style.autosize ?? defaultTextareaValues.autosize,
        hideIfDataIsEmpty:
          data.hideIfDataIsEmpty ?? defaultTextareaValues.hideIfDataIsEmpty,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
          }}
        />
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedTreeComponentPropsUpdate("placeholder", e.target.value);
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={INPUT_TYPES_DATA}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedTreeComponentPropsUpdate("type", value as string);
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
        <Flex gap={3}>
          <SizeSelector
            label="Label Spacing"
            {...form.getInputProps("labelSpacing")}
            onChange={(value) => {
              form.setFieldValue("labelSpacing", value as string);
              debouncedTreeComponentPropsUpdate("labelProps", {
                mb: value as string,
              });
            }}
          />
          <Select
            label="Label Weight"
            size="xs"
            data={[
              { label: "Normal", value: "normal" },
              { label: "Bold", value: "bold" },
            ]}
            {...form.getInputProps("labelWeight")}
            onChange={(value) => {
              form.setFieldValue("labelWeight", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                styles: { label: { fontWeight: value } },
              });
            }}
          />
        </Flex>
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
