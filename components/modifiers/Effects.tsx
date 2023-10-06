import { debouncedTreeUpdate } from "@/utils/editor";
import { NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTransform } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";

export const icon = IconTransform;
export const label = "Effects";

export const defaultEffectsValues = {
  cursor: "auto",
  overflow: "auto",
  opacity: 1,
  tooltip: "",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultEffectsValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const { style = {}, tooltip } = selectedComponent.props!;

      form.setValues({
        cursor: style.cursor ?? defaultEffectsValues.cursor,
        overflow: style.pointer ?? defaultEffectsValues.overflow,
        opacity: style.opacity ?? defaultEffectsValues.opacity,
        tooltip: tooltip ?? defaultEffectsValues.tooltip,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent?.id]);

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <Select
          label="Cursor"
          size="xs"
          data={[
            { label: "Auto", value: "auto" },
            { label: "Default", value: "default" },
            { label: "Pointer", value: "pointer" },
            { label: "Text", value: "text" },
            { label: "Wait", value: "wait" },
            { label: "Help", value: "help" },
            { label: "Progress", value: "progress" },
            { label: "Crosshair", value: "crosshair" },
            { label: "Copy", value: "copy" },
            { label: "Move", value: "move" },
            { label: "No-Drop", value: "no-drop" },
            { label: "Not Allowed", value: "not-allowed" },
            { label: "Zoom-In", value: "zoom-in" },
            { label: "Zoom-Out", value: "zoom-out" },
          ]}
          {...form.getInputProps("cursor")}
          onChange={(value) => {
            form.setFieldValue("cursor", value as string);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { cursor: value },
            });
          }}
        />
        <Select
          label="Overflow"
          size="xs"
          data={[
            { label: "Auto", value: "auto" },
            { label: "Visible", value: "visible" },
            { label: "Hidden", value: "hidden" },
            { label: "Scroll", value: "scroll" },
            { label: "Clip", value: "clip" },
            { label: "Initial", value: "initial" },
            { label: "Inherit", value: "inherit" },
          ]}
          {...form.getInputProps("overflow")}
          onChange={(value) => {
            form.setFieldValue("overflow", value as string);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { overflow: value },
            });
          }}
        />
        <NumberInput
          label="Opacity"
          size="xs"
          {...form.getInputProps("opacity")}
          precision={1}
          step={0.1}
          min={0}
          max={1}
          onChange={(value) => {
            form.setFieldValue("opacity", value as number);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { opacity: value },
            });
          }}
        />

        <TextInput
          label="Tooltip"
          size="xs"
          {...form.getInputProps("tooltip")}
          onChange={(e) => {
            form.setFieldValue("tooltip", e.target.value);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              tooltip: e.target.value,
            });
          }}
        />
      </Stack>
    </form>
  );
});
