import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel2 } from "@tabler/icons-react";
import { useEffect } from "react";
import { SpacingControl } from "./SpacingControl";

export const icon = IconBoxModel2;
export const label = "Spacing";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};
  const { style = {} } = componentProps;
  const initialValues = {
    padding: style.padding ?? "0px",
    paddingTop: style.paddingTop ?? undefined,
    paddingBottom: style.paddingBottom ?? undefined,
    paddingLeft: style.paddingLeft ?? undefined,
    paddingRight: style.paddingRight ?? undefined,
    margin: style.margin ?? "0px",
    marginTop: style.marginTop ?? undefined,
    marginBottom: style.marginBottom ?? undefined,
    marginLeft: style.marginLeft ?? undefined,
    marginRight: style.marginRight ?? undefined,
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
