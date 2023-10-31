import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSlash } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconSlash;
export const label = "Breadcrumb";

export const defaultBreadcrumbsValues = {
  separator: "/",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultBreadcrumbsValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["separator"]);
      form.setValues({
        separator: data.separator ?? defaultBreadcrumbsValues.separator,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Separator"
          size="xs"
          {...form.getInputProps("separator")}
          onChange={(e) => {
            form.setFieldValue("separator", e.target.value);
            debouncedTreeComponentPropsUpdate("separator", e.target.value);
          }}
        />
      </Stack>
    </form>
  );
});
