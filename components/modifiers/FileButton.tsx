import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";
import merge from "lodash.merge";
import { ChangeEvent, useEffect } from "react";

export const icon = IconFileUpload;
export const label = "File Upload";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.fileButton, {
          accept: selectedComponent.props?.accept,
          multiple: selectedComponent.props?.multiple,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const name = e.target.name;
      const value = e.target.value;
      form.setFieldValue(name, value);
      debouncedTreeComponentAttrsUpdate({
        attrs: { props: { [name]: value } },
      });
    };

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            size="xs"
            label="Allowed File Type(s)"
            placeholder="*/png, */pdf, */docx"
            name="accept"
            {...form.getInputProps("accept")}
            onChange={(e) => handleChange(e)}
          />
          <Switch
            size="xs"
            checked={form.values.multiple}
            {...form.getInputProps("multiple")}
            label="Allow multiple file upload"
            onChange={(e) => {
              form.setFieldValue("multiple", e.currentTarget.checked);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { multiple: e.currentTarget.checked } },
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
