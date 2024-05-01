import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { FieldType } from "./forms/StaticFormFieldsBuilder";

export const ProgressData = ({ component, endpoints }: DataProps) => {
  const staticFields = [
    {
      name: "value",
      label: "Value",
      type: "number" as FieldType,
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
