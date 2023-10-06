import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconColorFilter } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconColorFilter;
export const label = "Background";

export const defaultInputValues = {
  bg: "transparent",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["bg", "style"]);
      form.setValues({
        bg: data.bg ?? defaultInputValues.bg,
        ...data.style,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeComponentPropsUpdate("bg", value);
          }}
        />
      </Stack>
    </form>
  );
});
