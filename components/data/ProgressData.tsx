import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const ProgressData = ({ component, endpoints }: DataProps) => {
  const staticFields = [
    {
      name: "value",
      label: "Value",
      fieldType: "Number" as const,
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
