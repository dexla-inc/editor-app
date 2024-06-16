import { DataProps, FieldProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";
import { FormFieldsBuilder } from "./forms/FormFieldsBuilder";

const fields: FieldProps[] = [
  {
    name: "type",
    label: "Type",
    type: "segment",
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
    type: "select",
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
    type: "date",
  },
  {
    name: "placeholder",
    label: "Placeholder",
    type: "text",
  },
];

export const DateInputData = ({ component, endpoints }: DataProps) => {
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
