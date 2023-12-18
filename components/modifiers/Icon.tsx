import { IconSelector } from "@/components/IconSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { getThemeColor } from "@/components/modifiers/Border";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentStyleUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import merge from "lodash.merge";
import { SizeSelector } from "../SizeSelector";
import { useEffect } from "react";

export const icon = IconTexture;
export const label = "Icon";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const theme = useEditorStore((state) => state.theme);

    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.icon, {
          color: getThemeColor(theme, selectedComponent.props?.color),
          bg: selectedComponent.props?.bg,
          icon: selectedComponent.props?.name,
          size: selectedComponent.props?.size,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const handleColorChange = (_value: string) => {
      const [color, index] = _value.split(".");

      form.setFieldValue("color", _value);

      const value =
        _value != "transparent"
          ? // @ts-ignore
            theme.colors[color][index]
          : _value;

      debouncedTreeComponentStyleUpdate(selectedComponentIds, {
        color: value,
      });
    };

    const handleBackgroundColorChange = (_value: string) => {
      const [color, index] = _value.split(".");

      form.setFieldValue("bg", _value);

      const value =
        _value != "transparent" // @ts-ignore
          ? theme.colors[color][index]
          : _value;

      debouncedTreeUpdate(selectedComponentIds, {
        bg: value,
      });
    };

    const handleIconSelect = (value: string) => {
      form.setFieldValue("icon", value);
      debouncedTreeUpdate(selectedComponentIds, { name: value });
    };

    return (
      <form>
        <Stack spacing="xs">
          <IconSelector
            topLabel="Icon"
            selectedIcon={selectedComponent.props?.name}
            onIconSelect={handleIconSelect}
          />
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={handleColorChange}
          />
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("bg")}
            onChange={handleBackgroundColorChange}
          />
          <SizeSelector
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
              });
            }}
            showNone={false}
          />
        </Stack>
      </form>
    );
  },
);
