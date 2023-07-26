import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPhoto } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconPhoto;
export const label = "Image";

export const defaultImageValues = {
  src: "",
  alt: "",
  objectFit: "contain",
};

export const Modifier = () => {
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
    initialValues: defaultImageValues,
  });

  useEffect(() => {
    if (selectedComponent) {
      const { src, alt, style } = componentProps;
      form.setValues({
        src: src ?? defaultImageValues.src,
        alt: alt ?? defaultImageValues.alt,
        objectFit: style.objectFit ?? defaultImageValues.objectFit,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Source"
          type="url"
          size="xs"
          {...form.getInputProps("src")}
          onChange={(e) => {
            form.setFieldValue("src", e.target.value);
            debouncedTreeUpdate(selectedComponentId as string, {
              src: e.target.value,
            });
          }}
        />
        <TextInput
          label="Alternative Text"
          size="xs"
          {...form.getInputProps("alt")}
          onChange={(e) => {
            form.setFieldValue("alt", e.target.value);
            debouncedTreeUpdate(selectedComponentId as string, {
              alt: e.target.value,
            });
          }}
        />
        <Select
          label="Object Fit"
          size="xs"
          data={[
            { label: "Fill", value: "fill" },
            { label: "Contain", value: "contain" },
            { label: "Cover", value: "cover" },
            { label: "None", value: "none" },
            { label: "Scale down", value: "scale-down" },
          ]}
          {...form.getInputProps("objectFit")}
          onChange={(value) => {
            form.setFieldValue("objectFit", value as string);
            debouncedTreeUpdate(selectedComponentId as string, {
              style: { objectFit: value },
            });
          }}
        />
      </Stack>
    </form>
  );
};
