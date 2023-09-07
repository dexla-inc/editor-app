import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel } from "@tabler/icons-react";
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
            debouncedTreeComponentPropsUpdate("title", e.target.value);
          }}
        />
      </Stack>
    </form>
  );
};
