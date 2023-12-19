import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutKanban } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayoutKanban;
export const label = "Tab";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.tab, {
          value: selectedComponent?.props?.value,
          icon: selectedComponent?.props?.icon,
          iconColor: selectedComponent?.props?.iconColor,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                value: e.target.value,
              });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon as string}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeUpdate(selectedComponentIds, {
                icon: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Icon Color"
            {...form.getInputProps("iconColor")}
            onChange={(value: string) => {
              form.setFieldValue("iconColor", value);
              debouncedTreeUpdate(selectedComponentIds, {
                iconColor: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
