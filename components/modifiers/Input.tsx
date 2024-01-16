import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconForms;
export const label = "Input";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.input, {
          size: selectedComponent?.props?.size,
          placeholder: selectedComponent?.props?.placeholder,
          type: selectedComponent?.props?.type,
          icon: selectedComponent?.props?.icon,
          withAsterisk: selectedComponent?.props?.withAsterisk,
          clearable: selectedComponent?.props?.clearable,
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
          <Select
            label="Type"
            size="xs"
            data={INPUT_TYPES_DATA}
            {...form.getInputProps("type")}
            onChange={(value) => {
              form.setFieldValue("type", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                type: value,
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
          <IconSelector
            topLabel="Icon"
            selectedIcon={(form.values.icon as any)?.props?.name}
            onIconSelect={(iconName: string) => {
              const icon = { props: { name: iconName } };
              form.setFieldValue("icon.props.name", iconName);
              debouncedTreeUpdate(selectedComponentIds, {
                icon,
              });
            }}
          />
          <SwitchSelector
            topLabel="Required"
            {...form.getInputProps("withAsterisk")}
            checked={form.values.withAsterisk as boolean}
            onChange={(event) => {
              form.setFieldValue("withAsterisk", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                withAsterisk: event.currentTarget.checked,
              });
            }}
          />
          <SwitchSelector
            topLabel="Clearable"
            {...form.getInputProps("clearable")}
            checked={form.values.clearable as boolean}
            onChange={(event) => {
              form.setFieldValue("clearable", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                clearable: event.currentTarget.checked,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
