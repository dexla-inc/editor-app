import { SizeSelector } from "@/components/SizeSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSelect } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconSelect;
export const label = "Select";

export const defaultSelectValues = {
  size: "sm",
  placeholder: "Input",
  type: "text",
  label: "A label",
  icon: "",
  withAsterisk: false,
  labelSpacing: "0",
  data: ["Option 1", "Option 2"],
};

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
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
        ...style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  const debouncedUpdate = debounce((field: string, value: any) => {
    updateTreeComponent(selectedComponentId as string, {
      [field]: value,
    });
  }, 500);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedUpdate("label", e.target.value);
          }}
        />
        <Select
          label="Type"
          size="xs"
          data={[
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Password", value: "password" },
          ]}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedUpdate("type", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedUpdate("size", value as string);
          }}
        />
        {/* <IconSelector
          {...form.getInputProps("icon")}
          onChange={(value) => {
            form.setFieldValue("icon", value);
            debouncedUpdate("icon", value);
          }}
        /> */}

        <SizeSelector
          label="Label Spacing"
          {...form.getInputProps("labelProps")}
          onChange={(value) => {
            form.setFieldValue("labelProps", value as string);
            debouncedUpdate("labelProps", { mb: value as string });
          }}
        />
      </Stack>
    </form>
  );
};
