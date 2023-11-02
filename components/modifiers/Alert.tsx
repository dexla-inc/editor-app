import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconExclamationMark } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconExclamationMark;
export const label = "Alert";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: { ...requiredModifiers.alert },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["title", "color"]);

      form.setValues({
        title: data.title ?? requiredModifiers.alert.title,
        color: data.color ?? requiredModifiers.alert.color,
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
          label="Title"
          size="xs"
          {...form.getInputProps("title")}
          onChange={(e) => {
            form.setFieldValue("title", e.target.value);
            debouncedTreeComponentPropsUpdate("title", e.target.value);
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
      </Stack>
    </form>
  );
});
