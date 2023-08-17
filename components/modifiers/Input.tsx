import { SizeSelector } from "@/components/SizeSelector";
import { SwitchSelector } from "@/components/SwitchSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { Icon } from "../Icon";
import { IconSelector } from "../IconSelector";

export const icon = IconForms;
export const label = "Input";

export const defaultInputValues = {
  size: "sm",
  placeholder: "Input",
  type: "text",
  label: "",
  icon: "",
  withAsterisk: false,
  labelSpacing: "0",
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
    initialValues: defaultInputValues,
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
        size: size ?? defaultInputValues.size,
        placeholder: placeholder ?? defaultInputValues.placeholder,
        type: type ?? defaultInputValues.type,
        label: label ?? defaultInputValues.label,
        icon: icon ?? defaultInputValues.icon,
        withAsterisk: withAsterisk ?? defaultInputValues.withAsterisk,
        labelProps:
          labelProps.style?.marginBottom ?? defaultInputValues.labelSpacing,
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
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedUpdate("placeholder", e.target.value);
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
        <SwitchSelector
          topLabel="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(event) => {
            form.setFieldValue("withAsterisk", event.currentTarget.checked);
            debouncedUpdate("withAsterisk", event.currentTarget.checked);
          }}
        />
        <SizeSelector
          label="Label Spacing"
          {...form.getInputProps("labelProps")}
          onChange={(value) => {
            form.setFieldValue("labelProps", value as string);
            debouncedUpdate("labelProps", { mb: value as string });
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon}
          onIconSelect={(iconName: string) => {
            form.setFieldValue("icon", iconName);
            debouncedUpdate("icon", <Icon name={iconName} />);
          }}
        />
      </Stack>
    </form>
  );
};
