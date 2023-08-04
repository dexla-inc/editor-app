import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconBoxModel;
export const label = "Modal";

export const defaultModalValues = {
  title: "Modal Title",
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
    initialValues: {
      title: defaultModalValues.title,
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { title } = componentProps;

      form.setValues({
        title: title ?? defaultModalValues.title,
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
        <Textarea
          autosize
          label="Title"
          size="xs"
          {...form.getInputProps("title")}
          onChange={(e) => {
            form.setFieldValue("title", e.target.value);
            debouncedUpdate("title", e.target.value);
          }}
        />
      </Stack>
    </form>
  );
};
