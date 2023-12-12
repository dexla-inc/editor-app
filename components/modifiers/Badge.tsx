import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconIdBadge } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconIdBadge;
export const label = "Badge";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, requiredModifiers.badge, {
        value: selectedComponent.props?.children,
        type: selectedComponent.props?.type,
        variant: selectedComponent.props?.variant,
        size: selectedComponent.props?.size,
        radius: selectedComponent.props?.radius,
        color: selectedComponent.props?.color,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                children: e.target.value,
              });
            }}
          />
          <Select
            label="Variant"
            size="xs"
            data={[
              { label: "Filled", value: "filled" },
              { label: "Light", value: "light" },
              { label: "Outline", value: "outline" },
              { label: "Default", value: "default" },
              { label: "Dot", value: "dot" },
            ]}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                variant: value,
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
            data={[
              { label: "Extra Small", value: "xs" },
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
              { label: "Extra Large", value: "xl" },
            ]}
          />
          <SizeSelector
            label="Radius"
            {...form.getInputProps("radius")}
            onChange={(value) => {
              form.setFieldValue("radius", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                radius: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeUpdate(selectedComponentIds, {
                color: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
