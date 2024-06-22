import { DataProps, FieldProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "./forms/FormFieldsBuilder";

export const DateInputData = ({ component, endpoints }: DataProps) => {
  const fields: FieldProps[] = [
    {
      name: "type",
      label: "Type",
      fieldType: "Segmented",
      data: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Multiple",
          value: "multiple",
        },
        {
          label: "Range",
          value: "range",
        },
      ],
    },
    {
      name: "valueFormat",
      label: "Format",
      fieldType: "Select",
      data: [
        { label: "DD MMM YYYY", value: "DD MMM YYYY" },
        { label: "DD MM YYYY", value: "DD MM YYYY" },
        { label: "MM DD YYYY", value: "MM DD YYYY" },
        { label: "DD MMM", value: "DD MMM" },
        { label: "DD MMM YY", value: "DD MMM YY" },
        { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
        { label: "YYYY-MMM-DD", value: "YYYY-MMM-DD" },
      ],
    },
    {
      name: "value",
      label: "Value",
      fieldType: "Text",
      type: "date",
    },
    {
      name: "placeholder",
      label: "Placeholder",
      fieldType: "Text",
      type: "text",
    },
    {
      name: "validationMessage",
      label: "Validation message",
      fieldType: "Text",
      defaultValue: `${component.description} is required`,
    },
  ];

  return (
    <Stack spacing="xs">
      <FormFieldsBuilder
        fields={fields}
        component={component}
        endpoints={endpoints!}
      />
    </Stack>
  );
};
