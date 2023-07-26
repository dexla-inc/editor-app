import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconTexture;
export const label = "Background";

const extractBackgroundUrl = (backgroundImageValue: string): string => {
  const urlRegex = /url\(['"]?([^'"\(\)]+)['"]?\)/;
  const match = backgroundImageValue.match(urlRegex);

  if (match && match.length > 1) {
    return match[1];
  }

  return "";
};

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 500);

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: {
      bg: "transparent",
      backgroundImage: "",
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const { bg, style } = componentProps;
      form.setValues({
        bg: bg ?? "transparent",
        backgroundImage: style.backgroundImage
          ? extractBackgroundUrl(style.backgroundImage)
          : "",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeUpdate(selectedComponentId as string, {
              bg: value,
            });
          }}
          searchable
        />
        <TextInput
          label="Image URL"
          size="xs"
          placeholder="https://example.com/image.png"
          {...form.getInputProps("backgroundImage")}
          onChange={(e) => {
            const value = e.target.value;
            form.setFieldValue("backgroundImage", value);

            debouncedTreeUpdate(selectedComponentId as string, {
              style: { backgroundImage: `url(${value})` },
            });
          }}
        />
      </Stack>
    </form>
  );
};
