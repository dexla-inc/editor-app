import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

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

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: {
      bg: "transparent",
      backgroundImage: "",
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["bg", "style"]);
      form.setValues({
        bg: data.bg ?? "transparent",
        backgroundImage: data.style?.backgroundImage
          ? extractBackgroundUrl(data.style.backgroundImage)
          : "",
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              bg: value,
            });
          }}
        />
        <TextInput
          label="Image URL"
          size="xs"
          placeholder="https://example.com/image.png"
          {...form.getInputProps("backgroundImage")}
          onChange={(e) => {
            const value = e.target.value;
            form.setFieldValue("backgroundImage", value);

            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { backgroundImage: `url(${value})` },
            });
          }}
        />
      </Stack>
    </form>
  );
});
