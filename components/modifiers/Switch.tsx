import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconToggleLeft } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

const defaultInputValues = { label: "first", showLabel: true };

export const icon = IconToggleLeft;
export const label = "Switch";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["label", "showLabel"]);
      form.setValues({
        label: data.label ?? defaultInputValues.label,
        showLabel: data.showLabel ?? defaultInputValues.showLabel,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Label"
          size="xs"
          {...form.getInputProps("label")}
          onChange={(e) => {
            form.setFieldValue("label", e.target.value);
            debouncedTreeComponentPropsUpdate("label", e.target.value);
          }}
        />
        <Switch
          size="xs"
          checked={form.values.showLabel}
          label="Show Label"
          onChange={(e) => {
            form.setFieldValue("showLabel", e.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "showLabel",
              e.currentTarget.checked,
            );
          }}
        />
      </Stack>
    </form>
  );
});
