import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorTreeStore } from "@/stores/editorTree";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { ThemeColorSelector } from "../ThemeColorSelector";
import { useEffect } from "react";

const initialValues = requiredModifiers.navbar;

const Modifier = withModifier(({ selectedComponent }) => {
  const editorTree = useEditorTreeStore((state) => state.tree);

  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, initialValues, {
        width: selectedComponent?.props?.style?.width,
        bg: selectedComponent?.props?.bg ?? "transparent",
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const setNavbarWidth = (value: string) => {
    const contentWrapper = editorTree.root.children?.find(
      (child) => child.id === "content-wrapper",
    );

    const componentMutableAttrs =
      useEditorTreeStore.getState().componentMutableAttrs;
    const updateTreeComponentAttrs =
      useEditorTreeStore.getState().updateTreeComponentAttrs;

    // TODO: get this back - update content-wrapper width on componentMutableProps
    if (contentWrapper) {
      const contentWrapperAttrs = componentMutableAttrs["content-wrapper"];
      contentWrapperAttrs.props = {
        ...contentWrapperAttrs.props,
        navbarWidth: value,
      };
      updateTreeComponentAttrs({
        componentIds: [contentWrapperAttrs.id!],
        attrs: { ...contentWrapperAttrs },
      });
    }
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
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  style: { width: value },
                },
              },
            });
            setNavbarWidth(value as string);
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  bg: value,
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
