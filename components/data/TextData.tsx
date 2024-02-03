import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";

export const TextData = ({ component, endpoints }: DataProps) => {
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";

  const staticFields = [
    {
      name: isNavLink ? "label" : isFileButton ? "name" : "children",
      label: "Value",
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
