import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebar } from "@tabler/icons-react";
import merge from "lodash.merge";

export const initialValues = requiredModifiers.navbar;

export const label = "Navbar";
export const icon = IconLayoutSidebar;

export const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
        initialValues: merge({}, initialValues, {
            width: selectedComponent?.props?.style?.width,
        }),
    });
  const editorTree = useEditorStore((state) => state.tree);
  const setTree = useEditorStore((state) => state.setTree);

  const setNavbarWidth = (value: string) => {
    const contentWrapper = editorTree.root.children?.find(
      (child) => child.id === "content-wrapper",
    );
    if (contentWrapper) {
      contentWrapper.props = {
        ...contentWrapper.props,
        navbarWidth: value,
      };
    }
    setTree(editorTree);
  };

  return (
    <form>
      <Stack spacing="xs">
        <UnitInput
          modifierType="size"
          label="Width"
          {...form.getInputProps("width")}
          onChange={(value) => {
            form.setFieldValue("width", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                  style: { width: value },
              });
            setNavbarWidth(value as string);
          }}
        />
      </Stack>
    </form>
  );
});
