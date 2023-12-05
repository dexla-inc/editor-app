import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconClick;
export const label = "Link";

export const defaultInputValues = {
  value: "New Link",
  size: "sm",
  color: "Primary.6",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultInputValues, {
        value: selectedComponent.props?.children,
        size: selectedComponent.props?.size,
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
          <SizeSelector
            label="Size"
            {...form.getInputProps("size")}
            onChange={(value) => {
              form.setFieldValue("size", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                size: value,
              });
            }}
          />
          <ThemeColorSelector
            label="Color"
            value={form.getInputProps("color").value}
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
