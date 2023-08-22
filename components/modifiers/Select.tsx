import { SizeSelector } from "@/components/SizeSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSelect } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";

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
  data: [],
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

  const debouncedUpdate = debounce((field: string, value: any) => {
    updateTreeComponent(selectedComponentId as string, {
      [field]: value,
    });
  }, 500);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedUpdate(key, value);
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
            setFieldValue("type", value as string);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            setFieldValue("size", value as string);
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
