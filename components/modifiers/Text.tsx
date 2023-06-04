import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTextSize } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

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

  const form = useForm({
    initialValues: {
      value: "",
    },
  });

  useEffect(() => {
    if (selectedComponent) {
      const { children = "" } = selectedComponent.props || {};
      form.setValues({
        value: children,
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
          labelProps={{
            size: "xs",
          }}
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeUpdate(selectedComponentId as string, {
              children: e.target.value,
            });
          }}
        />
      </Stack>
    </form>
  );
};
