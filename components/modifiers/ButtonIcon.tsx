import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCircleDot } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SizeSelector } from "../SizeSelector";

export const icon = IconCircleDot;
export const label = "Button Icon";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.buttonIcon, {
          color: selectedComponent.props?.color,
          size: selectedComponent.props?.size,
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
              debouncedTreeUpdate(selectedComponentIds, { color: value });
            }}
          />
          <SizeSelector
            label="Size"
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, { size: value });
            }}
          />
        </Stack>
      </form>
    );
  },
);
