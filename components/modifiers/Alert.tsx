import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconExclamationMark } from "@tabler/icons-react";
import merge from "lodash.merge";
import { IconSelector } from "../IconSelector";
import { useEffect } from "react";

export const icon = IconExclamationMark;
export const label = "Alert";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.alert, {
          color: selectedComponent.props?.color,
          icon: selectedComponent.props?.icon,
          iconColor: selectedComponent.props?.iconColor,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
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
          <IconSelector
            topLabel="Icon"
            selectedIcon={selectedComponent.props?.icon}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeUpdate(selectedComponentIds, { icon: value });
            }}
          />
          <ThemeColorSelector
            label="Icon Color"
            {...form.getInputProps("iconColor")}
            onChange={(value: string) => {
              form.setFieldValue("iconColor", value);
              debouncedTreeUpdate(selectedComponentIds, {
                iconColor: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
