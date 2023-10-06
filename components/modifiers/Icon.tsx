import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconTexture;
export const label = "Icon";

export const defaultIconValues = {
  color: "Primary.6",
  icon: "",
};

type ColorMappings = {
  [index: string]: string;
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useEditorStore((state) => state.theme);

  const form = useForm({
    initialValues: defaultIconValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["style", "name"]);
      form.setValues({
        color: data.style?.color ?? "Primary.6",
        icon: data.name,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const handleColorChange = (value: string) => {
    let [color, index] = value.split(".");
    let opacity = 1;

    const colorMappings: ColorMappings = {
      Primary: "blue",
      Accent: "orange",
      Danger: "red",
      Warning: "yellow",
      Success: "green",
      Neutral: "gray",
      Black: "dark",
      White: "White",
      Border: "dark",
    };

    color = colorMappings[color] || "transparent";

    const variant = parseInt(index);
    const colorToRgb =
      color === "transparent"
        ? color
        : theme.fn.rgba(theme.colors[color][variant], opacity);

    form.setFieldValue("color", value);
    debouncedTreeUpdate(selectedComponent?.id as string, {
      style: { color: colorToRgb },
    });
  };

  const handleIconSelect = (value: string) => {
    form.setFieldValue("icon", value);
    debouncedTreeUpdate(selectedComponent?.id as string, { name: value });
  };

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={handleColorChange}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon}
          onIconSelect={handleIconSelect}
        />
      </Stack>
    </form>
  );
});
