import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import {
  Flex,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import merge from "lodash.merge";
import { TopLabel } from "../TopLabel";

export const icon = IconForms;
export const label = "Date Input";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.dateInput, {
        label: selectedComponent?.props?.label,
        type: selectedComponent?.props?.type,
        labelSize: selectedComponent?.props?.labelProps?.size,
        placeholder: selectedComponent?.props?.placeholder,
        description: selectedComponent?.props?.description,
        radius: selectedComponent?.props?.radius,
        size: selectedComponent?.props?.size,
        disabled: selectedComponent?.props?.isDisabled,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        clearable: selectedComponent?.props?.clearable,
        valueFormat: selectedComponent?.props?.valueFormat,
        icon: selectedComponent?.props?.icon,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            size="xs"
            label="Label"
            {...form.getInputProps("label")}
            onChange={(e) => {
              form.setFieldValue("label", e.target.value);
              const _value = !!e.target.value ? e.target.value : null;
              debouncedTreeUpdate(selectedComponentIds, { label: _value });
            }}
          />
          <SizeSelector
            label="Label Size"
            {...form.getInputProps("labelSize")}
            onChange={(value) => {
              form.setFieldValue("labelSize", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                labelProps: { size: value },
              });
            }}
          />
          <Stack spacing={2}>
            <TopLabel text="Type" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: "Default",
                  value: "default",
                },
                {
                  label: "Multiple",
                  value: "multiple",
                },
                {
                  label: "Range",
                  value: "range",
                },
              ]}
              {...form.getInputProps("type")}
              onChange={(value) => {
                form.setFieldValue("type", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  type: value as string,
                });
              }}
            />
          </Stack>
          <Select
            label="Format"
            size="xs"
            data={[{ label: "DD MMM YYYY", value: "DD MMM YYYY" }]}
            {...form.getInputProps("valueFormat")}
            onChange={(value) => {
              form.setFieldValue("valueFormat", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                valueFormat: value,
              });
            }}
          />
          <TextInput
            size="xs"
            label="Placeholder"
            {...form.getInputProps("placeholder")}
            onChange={(e) => {
              form.setFieldValue("placeholder", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                placeholder: e.target.value,
              });
            }}
          />
          <Flex justify="space-between">
            <SwitchSelector
              topLabel="Required"
              checked={form.getInputProps("withAsterisk").value}
              onChange={(e) => {
                form.setFieldValue("withAsterisk", e.currentTarget.checked);
                debouncedTreeUpdate(selectedComponentIds, {
                  withAsterisk: e.currentTarget.checked,
                });
              }}
            />
            <SwitchSelector
              topLabel="Clearable"
              checked={form.getInputProps("clearable").value}
              onChange={(e) => {
                form.setFieldValue("clearable", e.currentTarget.checked);
                debouncedTreeUpdate(selectedComponentIds, {
                  clearable: e.currentTarget.checked,
                });
              }}
            />
            <SwitchSelector
              topLabel="Disabled"
              checked={form.getInputProps("disabled").value}
              onChange={(e) => {
                form.setFieldValue("disabled", e.currentTarget.checked);
                debouncedTreeUpdate(selectedComponentIds, {
                  isDisabled: e.currentTarget.checked,
                });
              }}
            />
          </Flex>
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(e) => {
              form.setFieldValue("size", e);
              debouncedTreeUpdate(selectedComponentIds, {
                size: e,
              });
            }}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(e) => {
              form.setFieldValue("radius", e);
              debouncedTreeUpdate(selectedComponentIds, {
                radius: e,
              });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeUpdate(selectedComponentIds, {
                icon: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
