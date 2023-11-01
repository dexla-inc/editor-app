import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { getThemeColor } from "@/components/modifiers/Border";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconTexture;
export const label = "Icon";

export const defaultIconValues = requiredModifiers.icon;

export const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useEditorStore((state) => state.theme);

  const form = useForm({
    initialValues: defaultIconValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["style", "name"]);
      form.setValues({
        color: data.style?.color
          ? getThemeColor(theme, data.style.color)
          : defaultIconValues.color,
        icon: data.name ?? defaultIconValues.icon,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const handleColorChange = (_value: string) => {
    const [color, index] = _value.split(".");
    // @ts-ignore
    const value = theme.colors[color][index];
    form.setFieldValue("color", _value);

    debouncedTreeUpdate(selectedComponent?.id as string, {
      style: { color: value },
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
