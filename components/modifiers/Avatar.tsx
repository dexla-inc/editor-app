import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconUser;
export const label = "Avatar";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.avatar, {
        value: selectedComponent.props?.children,
        variant: selectedComponent.props?.variant,
        src: selectedComponent.props?.src,
        radius: selectedComponent.props?.radius,
        size: selectedComponent.props?.size,
        color: selectedComponent.props?.color,
      }),
    });

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
          <TextInput
            label="Text"
            type="text"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              const val = !!e.target.value ? e.target.value : null;
              debouncedTreeUpdate(selectedComponentIds, { children: val });
            }}
          />
          <TextInput
            label="Source"
            placeholder="https://example.com/image.png"
            type="url"
            size="xs"
            {...form.getInputProps("src")}
            onChange={(e) => {
              form.setFieldValue("src", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                src: e.target.value,
              });
            }}
          />
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
