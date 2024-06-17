import { DataProps, FieldType } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const CheckboxData = ({ component, endpoints }: DataProps) => {
  // We do this because CheckboxItem shares the same form, and we don't want to show the value field
  const staticFields = ["Checkbox", "Switch"].includes(component.name)
    ? [
        {
          name: "value",
          label: "Checked",
          fieldType: "Boolean" as FieldType,
        },
      ]
    : [];

  staticFields.push({
    name: "optionValue",
    label: "Value",
    fieldType: "Text" as FieldType,
  });

  return (
    <Stack spacing="xs">
      <FormFieldsBuilder
        fields={staticFields}
        component={component}
        endpoints={endpoints!}
      />
    </Stack>
  );
};
