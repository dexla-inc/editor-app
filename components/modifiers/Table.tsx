import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTable } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconTable;
export const label = "Table";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: {
      data: "",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { data = {} } = componentProps;
      form.setValues({
        data: JSON.stringify(data?.value ?? data, null, 2),
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
          label="Data"
          size="xs"
          {...form.getInputProps("data")}
          onChange={(e) => {
            form.setFieldValue("data", e.target.value);
            try {
              debouncedUpdate("data", JSON.parse(e.target.value ?? ""));
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </Stack>
    </form>
  );
};
