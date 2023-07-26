import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconH1 } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconH1;
export const label = "Title";

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
      color: "Black.6",
      order: "1",
    },
  });

  useEffect(() => {
    if (selectedComponent) {
      const { children = "", order, color } = componentProps;

      form.setValues({
        value: children,
        order: order?.toString() ?? "1",
        color: color ?? "Black.6",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
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
        <Select
          label="Order"
          size="xs"
          data={[
            { label: "H1", value: "1" },
            { label: "H2", value: "2" },
            { label: "H3", value: "3" },
            { label: "H4", value: "4" },
            { label: "H5", value: "5" },
            { label: "H6", value: "6" },
          ]}
          {...form.getInputProps("order")}
          onChange={(value) => {
            // @ts-ignore
            const size = theme.headings.sizes[`h${value}`];
            form.setFieldValue("order", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              order: parseInt(value as string, 10),
              style: {
                fontSize: size.fontSize,
                lineHeight: size.lineHeight,
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(_value: string) => {
            const [color, index] = _value.split(".");
            // @ts-ignore
            const value = theme.colors[color][index];
            form.setFieldValue("color", _value);

            debouncedTreeUpdate(selectedComponentId as string, {
              color: value,
            });
          }}
        />
      </Stack>
    </form>
  );
};
