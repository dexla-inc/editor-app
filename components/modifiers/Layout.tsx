import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlignBoxCenterMiddle,
  IconAlignBoxLeftMiddle,
  IconAlignBoxRightMiddle,
  IconAlignBoxCenterStretch,
  IconLayout2,
} from "@tabler/icons-react";
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
      alignItems: "center",
      justifyContent: "center",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;
      form.setValues({
        flexDirection: style.flexDirection ?? "row",
        rowGap: style.rowGap ?? "10px",
        columnGap: style.columnGap ?? "10px",
        alignItems: style.alignItems ?? "center",
        justifyContent: style.justifyContent ?? "center",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack>
        <Stack spacing={2}>
          <Text size="0.75rem">Direction</Text>
          <SegmentedControl
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
        </Stack>
        <Stack spacing={2}>
          <Text size="0.75rem">Gap</Text>
          <Group noWrap>
            <UnitInput
              label="Rows"
              {...form.getInputProps("rowGap")}
              onChange={(value) => {
                form.setFieldValue("rowGap", value as string);
                debouncedTreeUpdate(selectedComponentId as string, {
                  style: { rowGap: value },
                });
              }}
            />
            <UnitInput
              label="Columns"
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
        <Stack spacing={2}>
          <Text size="0.75rem">Align</Text>
          <SegmentedControl
            size="xs"
            data={[
              {
                label: (
                  <Tooltip label="Start" withinPortal>
                    <IconAlignBoxLeftMiddle size={14} />
                  </Tooltip>
                ),
                value: "flex-start",
              },
              {
                label: (
                  <Tooltip label="Center" withinPortal>
                    <IconAlignBoxCenterMiddle size={14} />
                  </Tooltip>
                ),
                value: "center",
              },
              {
                label: (
                  <Tooltip label="End" withinPortal>
                    <IconAlignBoxRightMiddle size={14} />
                  </Tooltip>
                ),
                value: "flex-end",
              },
              {
                label: (
                  <Tooltip label="Stretch" withinPortal>
                    <IconAlignBoxCenterStretch size={14} />
                  </Tooltip>
                ),
                value: "stretch",
              },
            ]}
            styles={{
              label: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              },
            }}
            {...form.getInputProps("alignItems")}
            onChange={(value) => {
              form.setFieldValue("alignItems", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { alignItems: value },
              });
            }}
          />
        </Stack>
        <Stack spacing={2}>
          <Text size="0.75rem">Justify</Text>
          <SegmentedControl
            size="xs"
            data={[
              {
                label: (
                  <Tooltip label="Start" withinPortal>
                    <IconAlignBoxLeftMiddle size={14} />
                  </Tooltip>
                ),
                value: "flex-start",
              },
              {
                label: (
                  <Tooltip label="Center" withinPortal>
                    <IconAlignBoxCenterMiddle size={14} />
                  </Tooltip>
                ),
                value: "center",
              },
              {
                label: (
                  <Tooltip label="End" withinPortal>
                    <IconAlignBoxRightMiddle size={14} />
                  </Tooltip>
                ),
                value: "flex-end",
              },
              {
                label: (
                  <Tooltip label="Space Between" withinPortal>
                    <IconAlignBoxCenterStretch size={14} />
                  </Tooltip>
                ),
                value: "space-between",
              },
              {
                label: (
                  <Tooltip label="Space Around" withinPortal>
                    <IconAlignBoxCenterMiddle size={14} />
                  </Tooltip>
                ),
                value: "space-around",
              },
            ]}
            styles={{
              label: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              },
            }}
            {...form.getInputProps("justifyContent")}
            onChange={(value) => {
              form.setFieldValue("justifyContent", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { justifyContent: value },
              });
            }}
          />
        </Stack>
      </Stack>
    </form>
  );
};
