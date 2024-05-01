import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";

export const TextInputData = ({ component, endpoints }: DataProps) => {
  const isTextArea = component.name === "Textarea";

  const staticFields = [
    {
      name: "value",
      label: "Value",
      type: isTextArea ? "text" : ("text" as FieldType),
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
