import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge(
        {},
        requiredModifiers.divider,
        { size: "xs" },
        {
          label: selectedComponent.props?.label,
          labelPosition: selectedComponent.props?.labelPosition,
          orientation: selectedComponent.props?.orientation,
          size: selectedComponent.props?.size,
          variant: selectedComponent.props?.variant,
          color: selectedComponent.props?.color,
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { label: e.target.value } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { labelPosition: value } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: { height }, orientation: value } },
            });
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { size: value } },
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { variant: value } },
            });
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { color: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
