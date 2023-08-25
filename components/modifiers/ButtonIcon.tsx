import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHandClick } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconHandClick;
export const label = "ButtonIcon";

export const defaultInputValues = {
  type: "button",
  color: "Primary.6",
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
      const { style = {}, type, color } = componentProps;
      form.setValues({
        type: type ?? defaultInputValues.type,
        color: color ?? defaultInputValues.color,
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
        <Select
          label="Type"
          size="xs"
          data={[
            { label: "button", value: "button" },
            { label: "submit", value: "submit" },
          ]}
          {...form.getInputProps("type")}
          onChange={(value) => {
            form.setFieldValue("type", value as string);
            debouncedUpdate("type", value as string);
          }}
        />

        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedUpdate("color", value);
          }}
        />
      </Stack>
    </form>
  );
};
