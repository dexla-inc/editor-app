import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";

export const CheckboxData = ({ component, endpoints }: DataProps) => {
  const staticFields = [
    {
      name: "checked",
      label: "Checked",
      type: "boolean" as FieldType,
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
