import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";
import merge from "lodash.merge";
import { ChangeEvent, useEffect } from "react";

export const icon = IconFileUpload;
export const label = "File";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.fileButton, {
          name: selectedComponent.props?.name,
          accept: selectedComponent.props?.accept,
          multiple: selectedComponent.props?.multiple,
          disabled: selectedComponent.props?.disabled,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const name = e.target.name;
      const value = e.target.value;
      form.setFieldValue(name, value);
      debouncedTreeUpdate(selectedComponentIds, {
        [name]: value,
      });
    };

    return (
      <form>
        <Stack spacing="xs">
          {selectedComponent?.name === "fileButton" && (
            <TextInput
              size="xs"
              label="Name"
              name="name"
              {...form.getInputProps("name")}
              onChange={(e) => handleChange(e)}
            />
          )}
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
              debouncedTreeUpdate(selectedComponentIds, {
                multiple: e.currentTarget.checked,
              });
            }}
          />
          <Switch
            size="xs"
            checked={form.values.disabled as boolean}
            label="Disabled"
            onChange={(e) => {
              form.setFieldValue("disabled", e.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                disabled: e.currentTarget.checked,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
