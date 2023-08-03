import { UnitInput } from "@/components/UnitInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, SegmentedControl, Select, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlignBoxBottomCenter,
  IconAlignBoxCenterMiddle,
  IconAlignBoxLeftMiddle,
  IconAlignBoxRightMiddle,
  IconLayout2,
} from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconLayout2;
export const label = "Layout";

export const defaultLayoutValues = {
  flexWrap: "wrap",
  flexDirection: "column",
  rowGap: "20px",
  columnGap: "20px",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
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
    initialValues: defaultLayoutValues,
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { style = {} } = componentProps;

      form.setValues({
        position: style.position ?? defaultLayoutValues.position,
        flexWrap: style.flexWrap ?? defaultLayoutValues.flexWrap,
        flexDirection: style.flexDirection ?? defaultLayoutValues.flexDirection,
        rowGap: style.rowGap ?? defaultLayoutValues.rowGap,
        columnGap: style.columnGap ?? defaultLayoutValues.columnGap,
        alignItems: style.alignItems ?? defaultLayoutValues.alignItems,
        justifyContent:
          style.justifyContent ?? defaultLayoutValues.justifyContent,
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
                  <StylingPaneItemIcon
                    label="Start"
                    icon={<IconAlignBoxLeftMiddle size={14} />}
                  />
                ),
                value: "flex-start",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Center"
                    icon={<IconAlignBoxCenterMiddle size={14} />}
                  />
                ),
                value: "center",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="End"
                    icon={<IconAlignBoxRightMiddle size={14} />}
                  />
                ),
                value: "flex-end",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Stretch"
                    icon={<IconAlignBoxBottomCenter size={14} />}
                  />
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
                  <StylingPaneItemIcon
                    label="Start"
                    icon={<IconAlignBoxLeftMiddle size={14} />}
                  />
                ),
                value: "flex-start",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Center"
                    icon={<IconAlignBoxCenterMiddle size={14} />}
                  />
                ),
                value: "center",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="End"
                    icon={<IconAlignBoxRightMiddle size={14} />}
                  />
                ),
                value: "flex-end",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Space Between"
                    icon={<IconAlignBoxBottomCenter size={14} />}
                  />
                ),
                value: "space-between",
              },
              {
                label: (
                  <StylingPaneItemIcon
                    label="Space Around"
                    icon={<IconAlignBoxCenterMiddle size={14} />}
                  />
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
        <Select
          label="Position"
          size="xs"
          data={[
            { label: "Relative", value: "relative" },
            { label: "Absolute", value: "absolute" },
            { label: "Sticky", value: "sticky" },
            { label: "Fixed", value: "fixed" },
          ]}
          {...form.getInputProps("position")}
          onChange={(value) => {
            form.setFieldValue("position", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { position: value },
            });
          }}
        />
        <Select
          label="Wrap"
          size="xs"
          data={[
            { label: "Wrap", value: "wrap" },
            { label: "Wrap Reverse", value: "wrap-reverse" },
            { label: "No Wrap", value: "no-wrap" },
          ]}
          {...form.getInputProps("flexWrap")}
          onChange={(value) => {
            form.setFieldValue("flexWrap", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { flexWrap: value },
            });
          }}
        />
      </Stack>
    </form>
  );
};
