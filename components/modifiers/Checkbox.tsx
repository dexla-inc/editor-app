import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Checkbox, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheckbox } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconCheckbox;
export const label = "Checkbox";

export const defaultInputValues = {
  label: "A label",
  checked: false,
  size: "sm",
  withAsterisk: false,
  labelSpacing: "0",
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
        size,
        withAsterisk,
        checked,
        labelProps = {},
      } = componentProps;

      form.setValues({
        size: size ?? defaultInputValues.size,
        label: label ?? defaultInputValues.label,
        withAsterisk: withAsterisk ?? defaultInputValues.withAsterisk,
        checked: checked ?? defaultInputValues.checked,
        labelProps:
          labelProps.style?.marginBottom ?? defaultInputValues.labelSpacing,
        ...style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form>
      <Stack spacing="xs">
        <Checkbox
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
          }}
        />
        <Checkbox
          label="Checked"
          size="xs"
          {...form.getInputProps("checked")}
          onChange={(e) => {
            form.setFieldValue("checked", e.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "checked",
              e.currentTarget.checked
            );
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value as string);
          }}
        />
        <SwitchSelector
          topLabel="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(event) => {
            form.setFieldValue("withAsterisk", event.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "withAsterisk",
              event.currentTarget.checked
            );
          }}
        />
        <SizeSelector
          label="Label Spacing"
          {...form.getInputProps("labelProps")}
          onChange={(value) => {
            form.setFieldValue("labelProps", value as string);
            debouncedTreeComponentPropsUpdate("labelProps", {
              mb: value as string,
            });
          }}
        />
      </Stack>
    </form>
  );
};
