import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import { withModifier } from "@/hoc/withModifier";
import { IconSelector } from "@/components/IconSelector";
import merge from "lodash.merge";

export const icon = IconClick;
export const label = "NavLink";

export const defaultNavLinkValues = {
  label: "Nav link",
  color: "transparent",
  align: "left",
  icon: "",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultNavLinkValues, {
        label: selectedComponent?.props?.label,
        icon: selectedComponent?.props?.icon,
        color: selectedComponent?.props?.color,
        align: selectedComponent?.props?.style?.align,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <Textarea
            autosize
            label="Label"
            size="xs"
            {...form.getInputProps("label")}
            onChange={(e) => {
              form.setFieldValue("label", e.target.value);
              debouncedTreeUpdate(selectedComponentIds, {
                label: e.target.value,
              });
            }}
          />
          <Select
            label="Align"
            size="xs"
            data={[
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ]}
            {...form.getInputProps("align")}
            onChange={(value) => {
              form.setFieldValue("align", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                style: { textAlign: value },
              });
            }}
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
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeUpdate(selectedComponentIds, {
                icon: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
