import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { ChangeEvent, useEffect } from "react";

export const defaultValues = {
  name: "Upload Button",
  accept: "",
  multiple: false,
  disabled: false,
};

export const icon = IconFileUpload;
export const label = "File Button";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultValues,
  });

  console.log(form.values);

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "name",
        "accept",
        "multiple",
        "disabled",
      ]);

      form.setValues({
        name: data.name ?? defaultValues.name,
        accept: data.accept ?? defaultValues.accept,
        multiple: data.multiple ?? defaultValues.multiple,
        disabled: data.disabled ?? defaultValues.disabled,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    form.setFieldValue(name, value);
    debouncedTreeComponentPropsUpdate(name, value);
  };

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          size="xs"
          label="Name"
          name="name"
          {...form.getInputProps("name")}
          onChange={(e) => handleChange(e)}
        />
        <TextInput
          size="xs"
          label="Accept"
          name="accept"
          {...form.getInputProps("accept")}
          onChange={(e) => handleChange(e)}
        />
        <Switch
          size="xs"
          checked={form.values.multiple}
          {...form.getInputProps("multiple")}
          label="Multiple"
          onChange={(e) => {
            form.setFieldValue("multiple", e.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "multiple",
              e.currentTarget.checked
            );
          }}
        />
        <Switch
          size="xs"
          checked={form.values.disabled}
          label="Disabled"
          onChange={(e) => {
            form.setFieldValue("disabled", e.currentTarget.checked);
            debouncedTreeComponentPropsUpdate(
              "disabled",
              e.currentTarget.checked
            );
          }}
        />
      </Stack>
    </form>
  );
});
