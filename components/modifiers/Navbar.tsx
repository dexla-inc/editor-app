import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutSidebar } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

const initialValues = requiredModifiers.navbar;

export const label = "Navbar";
export const icon = IconLayoutSidebar;

const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
  const editorTree = useEditorStore((state) => state.tree);
  const setTree = useEditorStore((state) => state.setTree);

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

    // TODO: get this back - update content-wrapper width on componentMutableProps
    // if (contentWrapper) {
    //   contentWrapper.props = {
    //     ...contentWrapper.props,
    //     navbarWidth: value,
    //   };
    // }
    // setTree(editorTree);
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
