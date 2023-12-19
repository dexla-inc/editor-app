import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTexture } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SizeSelector } from "../SizeSelector";

export const icon = IconTexture;
export const label = "Icon";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.icon, {
          color: selectedComponent.props?.color,
          bg: selectedComponent.props?.bg,
          icon: selectedComponent.props?.name,
          size: selectedComponent.props?.size,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

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
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, {
                color: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("bg")}
            onChange={(value: string) => {
              form.setFieldValue("bg", value);
              debouncedTreeUpdate(selectedComponentIds, {
                bg: value,
              });
            }}
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
