import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutKanban } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { SwitchSelector } from "../SwitchSelector";

export const icon = IconLayoutKanban;
export const label = "Tabs";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.tabs },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "defaultValue",
        "variant",
        "orientation",
        "radius",
        "color",
        "grow",
      ]);

      form.setValues({
        defaultValue: data.defaultValue ?? requiredModifiers.tabs.defaultValue,
        variant: data.variant ?? requiredModifiers.tabs.variant,
        orientation: data.orientation ?? requiredModifiers.tabs.orientation,
        radius: data.radius ?? requiredModifiers.tabs.radius,
        color: data.color ?? requiredModifiers.tabs.color,
        grow: data.grow ?? requiredModifiers.tabs.grow,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
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
            debouncedTreeComponentPropsUpdate("defaultValue", e.target.value);
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
              debouncedTreeComponentPropsUpdate("variant", value);
            }}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(value) => {
              form.setFieldValue("radius", value as string);
              debouncedTreeComponentPropsUpdate("radius", value);
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
              debouncedTreeComponentPropsUpdate("orientation", value);
            }}
          />
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeComponentPropsUpdate("color", value);
            }}
          />
        </Group>
        <SwitchSelector
          topLabel="Grow"
          {...form.getInputProps("grow")}
          onChange={(event) => {
            form.setFieldValue("grow", event.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "grow",
              event.currentTarget.checked,
            );
          }}
        />
      </Stack>
    </form>
  );
});
