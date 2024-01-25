import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { DynamicChildSettings } from "@/components/data/forms/DynamicChildSettings";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

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
