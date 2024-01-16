import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextPlus } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconTextPlus;
export const label = "Textarea";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.textarea, {
          placeholder: selectedComponent?.props?.placeholder,
          size: selectedComponent?.props?.size,
          autosize: selectedComponent?.props?.autosize,
          withAsterisk: selectedComponent?.props?.withAsterisk,
        }),
      );
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
          <SegmentedControlYesNo
            label="Required"
            {...form.getInputProps("withAsterisk")}
            onChange={(value) => {
              form.setFieldValue("withAsterisk", value);
              debouncedTreeUpdate(selectedComponentIds, {
                withAsterisk: value,
              });
            }}
          />
          <SegmentedControlYesNo
            label="Autosize"
            {...form.getInputProps("autosize")}
            onChange={(value) => {
              form.setFieldValue("autosize", value);
              debouncedTreeUpdate(selectedComponentIds, {
                autosize: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
