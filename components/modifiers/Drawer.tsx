import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { SegmentedControl, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebarLeftCollapse } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconLayoutSidebarLeftCollapse;
export const label = "Drawer";

export const defaultDrawerValues = {
  title: "Drawer Title",
  position: "left",
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
      title: defaultDrawerValues.title,
      position: defaultDrawerValues.position,
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { title, position } = componentProps;

      form.setValues({
        title: title ?? defaultDrawerValues.title,
        position: position ?? defaultDrawerValues.position,
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
        <Stack spacing={2}>
          <Text size="xs" fw={500}>
            Position
          </Text>
          <SegmentedControl
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Top", value: "top" },
              { label: "Right", value: "right" },
              { label: "Bottom", value: "bottom" },
            ]}
            {...form.getInputProps("position")}
            onChange={(value) => {
              form.setFieldValue("position", value as string);
              debouncedTreeComponentPropsUpdate("position", value);
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
};
