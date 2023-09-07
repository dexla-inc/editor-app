import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentStyleUpdate,
  getComponentById,
} from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutGrid } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconLayoutGrid;
export const label = "Display";

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
      display: "flex",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;
      form.setValues({
        display: style?.display ?? "flex",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack spacing="xs">
        <Select
          label="Type"
          size="xs"
          data={[
            { label: "inline", value: "inline" },
            { label: "block", value: "block" },
            { label: "flex", value: "flex" },
            { label: "none", value: "none" },
            { label: "inherit", value: "inherit" },
          ]}
          {...form.getInputProps("display")}
          onChange={(value) => {
            form.setFieldValue("display", value as string);
            debouncedTreeComponentStyleUpdate("display", value as string);
          }}
        />{" "}
      </Stack>
    </form>
  );
};
