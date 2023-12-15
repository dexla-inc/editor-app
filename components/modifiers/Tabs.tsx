import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutKanban } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayoutKanban;
export const label = "Tabs";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.tabs, {
          defaultValue: selectedComponent?.props?.defaultValue,
          variant: selectedComponent?.props?.variant,
          orientation: selectedComponent?.props?.orientation,
          radius: selectedComponent?.props?.radius,
          color: selectedComponent?.props?.color,
          grow: selectedComponent?.props?.grow,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Default Value"
            size="xs"
            {...form.getInputProps("defaultValue")}
            onChange={(e) => {
              form.setFieldValue("defaultValue", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                defaultValue: e.target.value,
              });
            }}
          />
          <Group noWrap>
            <Select
              label="Variant"
              size="xs"
              data={[
                { label: "Default", value: "default" },
                { label: "Outline", value: "outline" },
                { label: "Pills", value: "pills" },
              ]}
              {...form.getInputProps("variant")}
              onChange={(value) => {
                form.setFieldValue("variant", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  variant: value,
                });
              }}
            />
            <SizeSelector
              label="Radius"
              {...form.getInputProps("radius")}
              onChange={(value) => {
                form.setFieldValue("radius", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  radius: value,
                });
              }}
            />
          </Group>
          <Group noWrap>
            <Select
              label="Orientation"
              size="xs"
              data={[
                { label: "Horizontal", value: "horizontal" },
                { label: "Vertical", value: "vertical" },
              ]}
              {...form.getInputProps("orientation")}
              onChange={(value) => {
                form.setFieldValue("orientation", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  orientation: value,
                });
              }}
            />
            <ThemeColorSelector
              label="Color"
              {...form.getInputProps("color")}
              onChange={(value: string) => {
                form.setFieldValue("color", value);
                debouncedTreeUpdate(selectedComponentIds, {
                  color: value,
                });
              }}
            />
          </Group>
          <SwitchSelector
            topLabel="Grow"
            {...form.getInputProps("grow")}
            onChange={(event) => {
              form.setFieldValue("grow", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                grow: event.currentTarget.checked,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
