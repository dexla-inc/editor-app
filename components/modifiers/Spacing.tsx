import { SpacingControl } from "@/components/modifiers/SpacingControl";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel2 } from "@tabler/icons-react";
import { useEffect } from "react";

export const icon = IconBoxModel2;
export const label = "Spacing";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string,
  );

  const componentProps = selectedComponent?.props || {};
  const { style = {} } = componentProps;
  const spacing = requiredModifiers.spacing;

  const initialValues = {
    padding: style.padding ?? spacing.padding,
    paddingTop: style.paddingTop ?? spacing.paddingTop,
    paddingBottom: style.paddingBottom ?? spacing.paddingBottom,
    paddingLeft: style.paddingLeft ?? spacing.paddingLeft,
    paddingRight: style.paddingRight ?? spacing.paddingRight,
    margin: style.margin ?? spacing.margin,
    marginTop: style.marginTop ?? spacing.marginTop,
    marginBottom: style.marginBottom ?? spacing.marginBottom,
    marginLeft: style.marginLeft ?? spacing.marginLeft,
    marginRight: style.marginRight ?? spacing.marginRight,
  };

  const form = useForm({
    initialValues: {
      showPadding: "padding-all",
      showMargin: "margin-all",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      // Set initial form values

      form.setValues(initialValues);

      // Logic to set showPadding and showMargin values
      if (
        initialValues.paddingTop !== undefined ||
        initialValues.paddingBottom !== undefined ||
        initialValues.paddingLeft !== undefined ||
        initialValues.paddingRight !== undefined
      ) {
        form.setFieldValue("showPadding", "padding-sides");
      } else {
        form.setFieldValue("showPadding", "padding-all");
      }

      if (
        initialValues.marginTop !== undefined ||
        initialValues.marginBottom !== undefined ||
        initialValues.marginLeft !== undefined ||
        initialValues.marginRight !== undefined
      ) {
        form.setFieldValue("showMargin", "margin-sides");
      } else {
        form.setFieldValue("showMargin", "margin-all");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form key={selectedComponentId}>
      <Stack spacing="xs">
        <SpacingControl
          type="Padding"
          form={form}
          selectedComponentId={selectedComponentId as string}
        />
        <SpacingControl
          type="Margin"
          form={form}
          selectedComponentId={selectedComponentId as string}
        />
      </Stack>
    </form>
  );
};
