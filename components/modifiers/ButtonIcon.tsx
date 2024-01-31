import { IconSelector } from "@/components/IconSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCircleDot } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconCircleDot;
export const label = "Button Icon";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.buttonIcon, {
          color: selectedComponent.props?.color,
          iconProps: selectedComponent.props?.iconProps ?? {},
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const handleIconPropsChange = (key: string, value: string) => {
      form.setFieldValue(`iconProps.${key}`, value);
      debouncedTreeUpdate(selectedComponentIds, {
        iconProps: { [key]: value },
      });
    };

    return (
      <form>
        <Stack spacing="xs">
          <ThemeColorSelector
            label="Background"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, { color: value });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={selectedComponent.props?.iconProps?.name}
            onIconSelect={(value) => handleIconPropsChange("name", value)}
          />
          <ThemeColorSelector
            label="Icon Color"
            {...form.getInputProps("iconProps.color")}
            onChange={(value: string) => handleIconPropsChange("color", value)}
          />
          <SizeSelector
            label="Icon Size"
            {...form.getInputProps("iconProps.size")}
            onChange={(value: string) => handleIconPropsChange("size", value)}
            showNone={false}
          />
        </Stack>
      </form>
    );
  },
);
