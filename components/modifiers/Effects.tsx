import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBrush } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconBrush;
export const label = "Appearance";

const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.effects, {
        cursor: selectedComponent.props?.style?.cursor,
        overflow: selectedComponent.props?.style?.overflow,
        opacity: selectedComponent.props?.style?.opacity,
        tooltip: selectedComponent.props?.tooltip,
        javascriptCode: selectedComponent.props?.javascriptCode ?? "",
        display: selectedComponent.props?.style?.display,
        tooltipColor: selectedComponent.props?.tooltipColor,
        tooltipPosition: selectedComponent.props?.tooltipPosition,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { cursor: value } } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { overflow: value } } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { opacity: value } } },
            });
          }}
        />

        <TextInput
          label="Tooltip"
          size="xs"
          {...form.getInputProps("tooltip")}
          onChange={(e) => {
            const value = e.target.value;
            form.setFieldValue("tooltip", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { tooltip: value } },
            });
          }}
        />

        <ThemeColorSelector
          label="Tooltip Color"
          {...form.getInputProps("tooltipColor")}
          onChange={(value: string) => {
            form.setFieldValue("tooltipColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { tooltipColor: value } },
            });
          }}
        />
        <Select
          label="Tooltip Position"
          data={[
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
            { label: "Top", value: "top" },
            { label: "Bottom-End", value: "bottom-end" },
            { label: "Bottom-Start", value: "bottom-start" },
            { label: "Left-End", value: "left-end" },
            { label: "Left-Start", value: "left-start" },
            { label: "Right-End", value: "right-end" },
            { label: "Right-Start", value: "right-start" },
            { label: "Top-End", value: "top-end" },
            { label: "Top-Start", value: "top-start" },
          ]}
          {...form.getInputProps("tooltipPosition")}
          onChange={(value) => {
            form.setFieldValue("tooltipPosition", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { tooltipPosition: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
