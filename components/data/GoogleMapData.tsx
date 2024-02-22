import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { FieldType } from "./forms/StaticFormFieldsBuilder";

export const GoogleMapData = ({ component, endpoints }: DataProps) => {
  const fieldsGroup = {
    GoogleMap: [
      {
        name: "apiKey",
        label: "API Key",
        placeholder: "BJxbTxCS8ncCNBG7tNRPOdDbdx7fh3Or5qpIlZN",
        type: "text" as FieldType,
      },
      {
        name: "center.lat",
        label: "Latitude",
        placeholder: "25.816347481537285",
        type: "number" as FieldType,
        defaultValue: 25.816347481537285,
        decimalPlaces: 15,
      },
      {
        name: "center.lng",
        label: "Longitude",
        placeholder: "-80.1219500315037",
        type: "number" as FieldType,
        defaultValue: -80.1219500315037,
        decimalPlaces: 15,
      },
      {
        name: "zoom",
        label: "Zoom",
        placeholder: "15",
        type: "number" as FieldType,
        defaultValue: 15,
      },
      {
        name: "marker",
        label: "Marker",
        type: "yesno" as FieldType,
      },
    ],
  };
  const componentName = component.name as keyof typeof fieldsGroup;
  const fields = fieldsGroup[componentName];

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
