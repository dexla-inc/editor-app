import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const TextData = ({ component, endpoints }: DataProps) => {
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";

  const staticFields = [
    {
      name: isNavLink ? "label" : isFileButton ? "name" : "children",
      label: "Value",
      fieldType: "Text" as const,
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
