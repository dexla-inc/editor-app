import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDivide } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconDivide;
export const label = "Divider";

export const defaultInputValues = {
  color: "Neutral.9",
  label: "Divider",
  labelPosition: "center",
  orientation: "horizontal",
  size: "md",
  variant: "solid",
};

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );
  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const {
        style = {},
        label,
        labelPosition,
        orientation,
        size,
        variant,
      } = componentProps;
      form.setValues({
        label: label ?? defaultInputValues.label,
        labelPosition: labelPosition ?? defaultInputValues.labelPosition,
        orientation: orientation ?? defaultInputValues.orientation,
        size: size ?? defaultInputValues.size,
        variant: variant ?? defaultInputValues.variant,
        ...style,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
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
            debouncedTreeComponentPropsUpdate("labelPosition", value as string);
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
            debouncedTreeComponentPropsUpdate("orientation", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
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
            debouncedTreeComponentPropsUpdate("variant", value as string);
          }}
        />
        <ThemeColorSelector
          label="Text Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentPropsUpdate("color", value);
          }}
        />
      </Stack>
    </form>
  );
};
