import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { NumberInput, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTransform } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconTransform;
export const label = "Effects";

export const defaultEffectsValues = {
  cursor: "auto",
  overflow: "auto",
  opacity: 1,
};

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
    initialValues: defaultEffectsValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;

      form.setValues({
        cursor: style.cursor ?? defaultEffectsValues.cursor,
        overflow: style.pointer ?? defaultEffectsValues.overflow,
        opacity: style.opacity ?? defaultEffectsValues.opacity,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack spacing="xs">
        <Select
          label="Cursor"
          size="xs"
          data={[
            { label: "Auto", value: "auto" },
            { label: "Default", value: "default" },
            { label: "Pointer", value: "pointer" },
            { label: "Text", value: "text" },
            { label: "Wait", value: "wait" },
            { label: "Help", value: "help" },
            { label: "Progress", value: "progress" },
            { label: "Crosshair", value: "crosshair" },
            { label: "Copy", value: "copy" },
            { label: "Move", value: "move" },
            { label: "No-Drop", value: "no-drop" },
            { label: "Not Allowed", value: "not-allowed" },
            { label: "Zoom-In", value: "zoom-in" },
            { label: "Zoom-Out", value: "zoom-out" },
          ]}
          {...form.getInputProps("cursor")}
          onChange={(value) => {
            form.setFieldValue("cursor", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { cursor: value },
            });
          }}
        />
        <Select
          label="Overflow"
          size="xs"
          data={[
            { label: "Auto", value: "auto" },
            { label: "Visible", value: "visible" },
            { label: "Hidden", value: "hidden" },
            { label: "Scroll", value: "scroll" },
            { label: "Clip", value: "clip" },
            { label: "Initial", value: "initial" },
            { label: "Inherit", value: "inherit" },
          ]}
          {...form.getInputProps("overflow")}
          onChange={(value) => {
            form.setFieldValue("overflow", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { overflow: value },
            });
          }}
        />
        <NumberInput
          label="Opacity"
          size="xs"
          {...form.getInputProps("opacity")}
          onChange={(value) => {
            form.setFieldValue("opacity", value as number);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { opacity: value },
            });
          }}
        />
      </Stack>
    </form>
  );
};
