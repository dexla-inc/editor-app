import { DataProps, FieldType } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const TextInputData = ({ component, endpoints }: DataProps) => {
  const isTextArea = component.name === "Textarea";
  const addPlaceholder = !["Radio", "RadioItem"].includes(component.name);

  const defaultFields = [
    {
      name: "value",
      label: "Value",
      fieldType: isTextArea ? "Text" : ("Text" as const),
    },
  ];
  const staticFields = addPlaceholder
    ? [
        ...defaultFields,
        {
          name: "placeholder",
          label: "Placeholder",
          type: "text" as FieldType,
        },
      ]
    : defaultFields;

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
