import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconTexture;
export const label = "Icon";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 500);

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: {
      color: "Primary.6",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style } = componentProps;
      form.setValues({
        color: style?.color ?? "Primary.6",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { color: value },
            });
          }}
        />
      </Stack>
    </form>
  );
};
