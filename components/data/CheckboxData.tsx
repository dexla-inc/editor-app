import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";

export const CheckboxData = ({ component, endpoints }: DataProps) => {
  const staticFields = [
    {
      name: "value",
      label: "Checked",
      type: "boolean" as FieldType,
    },
    {
      name: "optionValue",
      label: "Value",
      type: "text" as FieldType,
    },
  ];

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
