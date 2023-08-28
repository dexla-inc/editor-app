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
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 500);

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
    if (selectedComponentId) {
      const { children = "", order, color } = componentProps;

      let data = {
        value: children,
        order,
        color,
      };

      const currentState =
        currentTreeComponentsStates?.[selectedComponentId] ?? "default";

      if (currentState !== "default") {
        data = {
          ...data,
          ...(selectedComponent?.states?.[currentState] ?? {}),
        };
      }

      form.setValues({
        value: data.value,
        order: data.order?.toString() ?? "1",
        color: data.color ?? "Black.6",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  const debouncedUpdate = debounce((field: string, value: any) => {
    updateTreeComponent(selectedComponentId as string, {
      [field]: value,
    });
  }, 500);

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
            debouncedUpdate("children", e.target.value);
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
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedUpdate("color", value);
          }}
        />
      </Stack>
    </form>
  );
};
