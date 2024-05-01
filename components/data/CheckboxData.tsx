import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";

export const CheckboxData = ({ component, endpoints }: DataProps) => {
  // We do this because CheckboxItem shares the same form, and we don't want to show the value field
  const staticFields = ["Checkbox", "Switch"].includes(component.name)
    ? [
        {
          name: "value",
          label: "Checked",
          type: "boolean" as FieldType,
        },
      ]
    : [];

  staticFields.push({
    name: "optionValue",
    label: "Value",
    type: "text" as FieldType,
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
