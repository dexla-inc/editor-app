import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import { IconSelector } from "@/components/IconSelector";

export const icon = IconClick;
export const label = "NavLink";

export const defaultNavLinkValues = {
  label: "Nav link",
  color: "transparent",
  align: "left",
  icon: "",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultNavLinkValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "label",
        "icon",
        "color",
        "align",
      ]);

      form.setValues({
        label: data.label ?? defaultNavLinkValues.label,
        icon: data.icon ?? defaultNavLinkValues.icon,
        align: data.align ?? defaultNavLinkValues.align,
        color: data.color ?? defaultNavLinkValues.color,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

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
            debouncedTreeComponentPropsUpdate("label", e.target.value);
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
            debouncedTreeUpdate(selectedComponent?.id as string, {
              style: { textAlign: value },
            });
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeComponentPropsUpdate("color", value);
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon}
          onIconSelect={(value: string) => {
            form.setFieldValue("icon", value);
            debouncedTreeComponentPropsUpdate("icon", value);
          }}
        />
      </Stack>
    </form>
  );
});
