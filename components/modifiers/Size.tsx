import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconResize } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";

export const icon = IconResize;
export const label = "Size";

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
    initialValues: {
      width: "",
      height: "",
      minWidth: "",
      minHeight: "",
    },
  });

  useEffect(() => {
    if (selectedComponent) {
      const { style = {} } = componentProps;
      form.setValues(style);
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack>
        <Group noWrap>
          <UnitInput
            label="Width"
            {...form.getInputProps("width")}
            onChange={(value) => {
              form.setFieldValue("width", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { width: value },
              });
            }}
          />
          <UnitInput
            label="Height"
            {...form.getInputProps("height")}
            onChange={(value) => {
              form.setFieldValue("height", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { height: value },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Min Width"
            {...form.getInputProps("minWidth")}
            onChange={(value) => {
              form.setFieldValue("minWidth", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { minWidth: value },
              });
            }}
          />
          <UnitInput
            label="Min Height"
            {...form.getInputProps("minHeight")}
            onChange={(value) => {
              form.setFieldValue("minHeight", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { minHeight: value },
              });
            }}
          />
        </Group>
      </Stack>
    </form>
  );
};
