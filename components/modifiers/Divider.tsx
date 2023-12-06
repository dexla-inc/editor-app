import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDivide } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconDivide;
export const label = "Divider";

export const defaultInputValues = {
  color: "Neutral.9",
  label: "Divider",
  labelPosition: "center",
  orientation: "horizontal",
  size: "xs",
  variant: "solid",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultInputValues, {
        label: selectedComponent.props?.label,
        labelPosition: selectedComponent.props?.labelPosition,
        orientation: selectedComponent.props?.orientation,
        size: selectedComponent.props?.size,
        variant: selectedComponent.props?.variant,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Label"
            size="xs"
            {...form.getInputProps("label")}
            onChange={(e) => {
              form.setFieldValue("label", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                label: e.target.value,
              });
            }}
          />
          <Select
            label="Label Position"
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
              { label: "Center", value: "center" },
            ]}
            {...form.getInputProps("labelPosition")}
            onChange={(value) => {
              form.setFieldValue("labelPosition", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                labelPosition: value,
              });
            }}
          />
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
              const height = value === "horizontal" ? "auto" : "20px";
              debouncedTreeUpdate(selectedComponentIds, {
                style: { height },
                orientation: value,
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
          <Select
            label="Variant"
            size="xs"
            data={[
              { label: "Solid", value: "solid" },
              { label: "Dashed", value: "dashed" },
              { label: "Dotted", value: "dotted" },
            ]}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                variant: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Text Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, {
                color: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
