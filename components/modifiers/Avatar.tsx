import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconUser;
export const label = "Avatar";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.avatar, {
          variant: selectedComponent.props?.variant,
          radius: selectedComponent.props?.radius,
          size: selectedComponent.props?.size,
          color: selectedComponent.props?.color,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const variantOptions: Record<string, string> = {
      Default: "default",
      White: "white",
      Filled: "filled",
      Light: "light",
      Outline: "outline",
      Transparent: "transparent",
    };

    return (
      <form>
        <Stack spacing="xs">
          <Select
            label="Variant"
            size="xs"
            data={Object.keys(variantOptions).map((key) => ({
              label: key,
              value: variantOptions[key],
            }))}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeUpdate(selectedComponentIds, { variant: value });
            }}
          />
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
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(value) => {
              form.setFieldValue("radius", value as string);
              debouncedTreeUpdate(selectedComponentIds, { radius: value });
            }}
          />
        </Stack>
      </form>
    );
  },
);
