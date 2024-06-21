import { DataProps, FieldProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const CheckboxData = ({ component, endpoints }: DataProps) => {
  // We do this because CheckboxItem shares the same form, and we don't want to show the value field
  const staticFields: FieldProps[] = ["Checkbox", "Switch"].includes(
    component.name,
  )
    ? [
        {
          name: "value",
          label: "Checked",
          fieldType: "YesNo",
          useTrueOrFalseStrings: true,
        },
        {
          name: "validationMessage",
          label: "Validation message",
          fieldType: "Text" as const,
          defaultValue: `${component.description} is required`,
        },
      ]
    : [];

  staticFields.push({
    name: "optionValue",
    label: "Value",
    fieldType: "Text",
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
