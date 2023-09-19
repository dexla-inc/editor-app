import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Checkbox, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconBoxModel;
export const label = "Modal";

export const defaultModalValues = {
  title: "Modal Title",
  forceHide: false,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: {
      title: defaultModalValues.title,
      forceHide: defaultModalValues.forceHide,
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["title", "forceHide"]);

      form.setValues({
        title: data.title ?? defaultModalValues.title,
        forceHide: data.forceHide ?? defaultModalValues.forceHide,
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
        <Checkbox
          size="xs"
          label="Force Hide"
          {...form.getInputProps("forceHide", { type: "checkbox" })}
          onChange={(e) => {
            form.setFieldValue("forceHide", e.target.checked);
            debouncedTreeComponentPropsUpdate("forceHide", e.target.checked);
          }}
        />
      </Stack>
    </form>
  );
});
