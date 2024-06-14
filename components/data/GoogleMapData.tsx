import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps, FieldType } from "@/types/dataBinding";
import { Stack } from "@mantine/core";

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
        name: "centerLat",
        label: "Latitude",
        placeholder: "25.816347481537285",
        type: "number" as FieldType,
        decimalPlaces: 15,
      },
      {
        name: "centerLng",
        label: "Longitude",
        placeholder: "-80.1219500315037",
        type: "number" as FieldType,
        decimalPlaces: 15,
      },
      {
        name: "zoom",
        label: "Zoom",
        placeholder: "15",
        type: "number" as FieldType,
      },
      {
        name: "markers",
        label: "Markers",
        type: "text" as FieldType,
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
