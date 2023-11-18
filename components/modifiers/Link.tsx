import { SizeSelector } from "@/components/SizeSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconClick } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconClick;
export const label = "Link";

export const defaultInputValues = {
  value: "New Link",
  size: "md",
  color: "teal",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "style",
        "children",
        "size",
        "color",
      ]);

      form.setValues({
        value: data.children ?? defaultInputValues.value,
        size: data.size ?? defaultInputValues.size,
        color: data.color ?? defaultInputValues.color,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              children: e.target.value,
            });
          }}
        />
        <SizeSelector
          label="Size"
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentPropsUpdate("size", value);
          }}
        />
        <ThemeColorSelector
          label="Color"
          {...form.getInputProps("color")}
          onChange={(value: string) => {
            form.setFieldValue("color", value);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              color: value,
            });
          }}
        />
      </Stack>
    </form>
  );
});
