import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { ColorInput, Group, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";

export const icon = IconTextSize;
export const label = "Text";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 400);

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
      color: "",
    },
  });

  useEffect(() => {
    if (selectedComponent) {
      const { children = "", style = {} } = componentProps;
      form.setValues({
        value: children,
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
            debouncedTreeUpdate(selectedComponentId as string, {
              children: e.target.value,
            });
          }}
        />
        <Group noWrap>
          <UnitInput label="Size" {...form.getInputProps("fontSize")} />
          <Select
            label="Weight"
            size="xs"
            data={[
              { label: "Thin", value: "thin" },
              { label: "Normal", value: "normal" },
              { label: "Bold", value: "bold" },
            ]}
            {...form.getInputProps("fontWeight")}
          />
        </Group>
        <Group noWrap>
          <UnitInput
            label="Line Height"
            {...form.getInputProps("lineHeight")}
          />
          <UnitInput
            label="Letter Spacing"
            disabledUnits={["%"]}
            {...form.getInputProps("letterSpacing")}
          />
        </Group>
        <ColorInput size="xs" label="Color" {...form.getInputProps("color")} />
      </Stack>
    </form>
  );
};
