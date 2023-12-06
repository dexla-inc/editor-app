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
import merge from "lodash.merge";

export const icon = IconTexture;
export const label = "Icon";

export const defaultIconValues = requiredModifiers.icon;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const theme = useEditorStore((state) => state.theme);

    const form = useForm({
      initialValues: merge({}, defaultIconValues, {
        color: getThemeColor(theme, selectedComponent.props?.color),
        icon: selectedComponent.props?.icon,
      }),
    });

    const handleColorChange = (_value: string) => {
      const [color, index] = _value.split(".");
      // @ts-ignore
      const value = theme.colors[color][index];
      form.setFieldValue("color", _value);

      debouncedTreeUpdate(selectedComponentIds, {
        style: { color: value },
      });
    };

    const handleIconSelect = (value: string) => {
      form.setFieldValue("icon", value);
      debouncedTreeUpdate(selectedComponentIds, { name: value });
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
  },
);
