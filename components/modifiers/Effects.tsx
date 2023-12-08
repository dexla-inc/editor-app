import { debouncedTreeUpdate } from "@/utils/editor";
import { NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTransform } from "@tabler/icons-react";
import { withModifier } from "@/hoc/withModifier";
import merge from "lodash.merge";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";

export const icon = IconTransform;
export const label = "Effects";

export const defaultEffectsValues = {
  cursor: "auto",
  overflow: "auto",
  opacity: 1,
  tooltip: "",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultEffectsValues, {
        cursor: selectedComponent.props?.style?.cursor,
        overflow: selectedComponent.props?.style?.overflow,
        opacity: selectedComponent.props?.style?.opacity,
        tooltip: selectedComponent.props?.tooltip,
      }),
    });

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
              debouncedTreeUpdate(selectedComponentIds, {
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
              debouncedTreeUpdate(selectedComponentIds, {
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
              debouncedTreeUpdate(selectedComponentIds, {
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
              debouncedTreeUpdate(selectedComponentIds, {
                tooltip: e.target.value,
              });
            }}
          />

          <ThemeColorSelector
            label="Tooltip Color"
            {...form.getInputProps("tooltipColor")}
            onChange={(value: string) => {
              form.setFieldValue("tooltipColor", value);
              debouncedTreeUpdate(selectedComponentIds, {
                tooltipColor: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
