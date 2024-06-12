import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const TextInputData = ({ component, endpoints }: DataProps) => {
  const isTextArea = component.name === "Textarea";

  const staticFields = [
    {
      name: "value",
      label: "Value",
      fieldType: isTextArea ? "Text" : ("Text" as const),
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
