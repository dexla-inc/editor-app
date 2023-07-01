import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, Select, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayout2 } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";

export const icon = IconLayout2;
export const label = "Layout";

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
      flexDirection: "row",
      rowGap: "10px",
      columnGap: "10px",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;
      form.setValues({
        flexDirection: style.flexDirection ?? "row",
        rowGap: style.rowGap ?? "10px",
        columnGap: style.columnGap ?? "10px",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack>
        <Select
          label="Direction"
          size="xs"
          data={[
            { label: "Horizontal", value: "row" },
            { label: "Vertical", value: "column" },
          ]}
          {...form.getInputProps("flexDirection")}
          onChange={(value) => {
            form.setFieldValue("flexDirection", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { flexDirection: value },
            });
          }}
        />
        <Stack spacing={2}>
          <Text size="0.75rem">Gap</Text>
          <Group noWrap>
            <UnitInput
              label="Horizontal"
              {...form.getInputProps("rowGap")}
              onChange={(value) => {
                form.setFieldValue("rowGap", value as string);
                debouncedTreeUpdate(selectedComponentId as string, {
                  style: { rowGap: value },
                });
              }}
            />
            <UnitInput
              label="Vertical"
              {...form.getInputProps("columnGap")}
              onChange={(value) => {
                form.setFieldValue("columnGap", value as string);
                debouncedTreeUpdate(selectedComponentId as string, {
                  style: { columnGap: value },
                });
              }}
            />
          </Group>
        </Stack>
      </Stack>
    </form>
  );
};
