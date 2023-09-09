import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { SizeSelector } from "@/components/SizeSelector";
import { useEditorStore } from "@/stores/editor";
import { INPUT_TYPES_DATA } from "@/utils/dashboardTypes";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSelect } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconSelect;
export const label = "Select";

export const defaultSelectValues = {
  size: "sm",
  placeholder: "Select",
  type: "text",
  label: "A label",
  icon: "",
  withAsterisk: false,
  labelSpacing: "0",
  data: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
  ],
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
    initialValues: defaultSelectValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const {
        style = {},
        label,
        size,
        placeholder,
        type,
        icon,
        data = [],
        withAsterisk,
        labelProps = {},
      } = componentProps;

      form.setValues({
        size: size ?? defaultSelectValues.size,
        placeholder: placeholder ?? defaultSelectValues.placeholder,
        type: type ?? defaultSelectValues.type,
        label: label ?? defaultSelectValues.label,
        icon: icon ?? defaultSelectValues.icon,
        withAsterisk: withAsterisk ?? defaultSelectValues.withAsterisk,
        labelProps:
          labelProps.style?.marginBottom ?? defaultSelectValues.labelSpacing,
        data: data ?? defaultSelectValues.data,
        ...style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentPropsUpdate(key, value);
  };

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            setFieldValue("label", e.target.value);
          }}
        />
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            setFieldValue("placeholder", e.target.value);
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={INPUT_TYPES_DATA}
          {...form.getInputProps("type")}
          onChange={(value) => {
            setFieldValue("type", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            setFieldValue("size", value as string);
          }}
        />

        <SizeSelector
          label="Label Spacing"
          {...form.getInputProps("labelProps")}
          onChange={(value) => {
            setFieldValue("labelProps", value as string);
          }}
        />
        <SelectOptionsForm
          getValue={() => form.getInputProps("data").value}
          setFieldValue={setFieldValue}
        />
      </Stack>
    </form>
  );
};
