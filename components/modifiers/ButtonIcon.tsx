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
          iconName: selectedComponent.props?.iconName,
          iconSize: selectedComponent.props?.iconSize,
          iconColor: selectedComponent.props?.iconColor,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const handleIconPropsChange = (key: string, value: string) => {
      form.setFieldValue(key, value);
      debouncedTreeUpdate(selectedComponentIds, {
        [key]: value,
      });
    };

    return (
      <form>
        <Stack spacing="xs">
          <ThemeColorSelector
            label="Background"
            {...form.getInputProps("color")}
            onChange={(value: string) => handleIconPropsChange("color", value)}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={selectedComponent.props?.iconName}
            onIconSelect={(value) => handleIconPropsChange("iconName", value)}
          />
          <ThemeColorSelector
            label="Icon Color"
            {...form.getInputProps("iconColor")}
            onChange={(value: string) =>
              handleIconPropsChange("iconColor", value)
            }
          />
          <SizeSelector
            label="Icon Size"
            {...form.getInputProps("iconSize")}
            onChange={(value: string) =>
              handleIconPropsChange("iconSize", value)
            }
            showNone={false}
          />
        </Stack>
      </form>
    );
  },
);
