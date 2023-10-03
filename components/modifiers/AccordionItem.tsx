import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutBottombarCollapse } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

const defaultInputValues = { value: "first" };

export const icon = IconLayoutBottombarCollapse;
export const label = "Accordion Item";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["value"]);
      form.setValues({
        value: data.value ?? defaultInputValues.value,
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
            debouncedTreeComponentPropsUpdate("value", e.target.value);
          }}
        />
      </Stack>
    </form>
  );
});
