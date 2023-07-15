import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Group, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";

export const icon = IconTextSize;
export const label = "Text";

export const Modifier = () => {
  const theme = useEditorStore((state) => state.theme);
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
      value: "",
      fontSize: "",
      fontWeight: "",
      lineHeight: "",
      letterSpacing: "",
      color: "Black.6",
    },
  });

  useEffect(() => {
    if (selectedComponent) {
      const { children = "", style = {}, color } = componentProps;
      form.setValues({
        value: children,
        color: color ?? "Black.6",
        ...style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack>
        <Textarea
          autosize
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            updateTreeComponent(selectedComponentId as string, {
              children: e.target.value,
            });
          }}
        />
        <Group noWrap>
          <UnitInput
            label="Size"
            {...form.getInputProps("fontSize")}
            onChange={(value) => {
              form.setFieldValue("fontSize", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { fontSize: value },
              });
            }}
          />
          <Select
            label="Weight"
            size="xs"
            data={[
              { label: "Normal", value: "normal" },
              { label: "Bold", value: "bold" },
            ]}
            {...form.getInputProps("fontWeight")}
            onChange={(value) => {
              form.setFieldValue("fontWeight", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { fontWeight: value },
              });
            }}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Line Height"
            {...form.getInputProps("lineHeight")}
            onChange={(value) => {
              form.setFieldValue("lineHeight", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { lineHeight: value },
              });
            }}
          />
          <UnitInput
            label="Letter Spacing"
            disabledUnits={["%"]}
            {...form.getInputProps("letterSpacing")}
            onChange={(value) => {
              form.setFieldValue("letterSpacing", value as string);
              debouncedTreeUpdate(selectedComponentId as string, {
                style: { letterSpacing: value },
              });
            }}
          />
        </Group>
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeUpdate(selectedComponentId as string, {
              color: value,
            });
          }}
        />
      </Stack>
    </form>
  );
};
