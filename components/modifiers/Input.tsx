import { SizeSelector } from "@/components/SizeSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconForms } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconForms;
export const label = "Input";

export const defaultInputValues = {
  size: "sm",
  placeholder: "Input",
  type: "text",
};

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 200);

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent) {
      const { style = {}, size, placeholder, type } = componentProps;
      form.setValues({
        size: size ?? defaultInputValues.size,
        placeholder: placeholder ?? defaultInputValues.placeholder,
        type: type ?? defaultInputValues.type,
        ...style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            form.setFieldValue("placeholder", e.target.value);
            debouncedTreeUpdate(selectedComponentId as string, {
              placeholder: e.target.value,
            });
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
            debouncedTreeUpdate(selectedComponentId as string, {
              type: value,
            });
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              size: value,
            });
          }}
        />
      </Stack>
    </form>
  );
};
