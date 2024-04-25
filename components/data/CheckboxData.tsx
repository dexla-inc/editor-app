import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";

export const CheckboxData = ({ component, endpoints }: DataProps) => {
  const staticFields =
    component.name === "Checkbox"
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
