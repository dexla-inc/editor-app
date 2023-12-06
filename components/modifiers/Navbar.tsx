import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeComponentStyleUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebar } from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const initialValues = requiredModifiers.navbar;

export const label = "Navbar";
export const icon = IconLayoutSidebar;

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({ initialValues });
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

  useEffect(() => {
    if (selectedComponent?.id) {
      const { width } = pick(selectedComponent.props!.style, ["width"]);
      form.setValues(merge({}, initialValues, { width }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <UnitInput
          modifierType="size"
          label="Width"
          {...form.getInputProps("width")}
          onChange={(value) => {
            form.setFieldValue("width", value as string);
            debouncedTreeComponentStyleUpdate("width", value as string);
            setNavbarWidth(value as string);
          }}
        />
      </Stack>
    </form>
  );
});
