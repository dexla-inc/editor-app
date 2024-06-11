import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";

export const GoogleMapData = ({ component, endpoints }: DataProps) => {
  const fieldsGroup = {
    GoogleMap: [
      {
        name: "apiKey",
        label: "API Key",
        placeholder: "BJxbTxCS8ncCNBG7tNRPOdDbdx7fh3Or5qpIlZN",
        type: "Text" as const,
      },
      {
        name: "centerLat",
        label: "Latitude",
        placeholder: "25.816347481537285",
        type: "Number" as const,
        decimalPlaces: 15,
      },
      {
        name: "centerLng",
        label: "Longitude",
        placeholder: "-80.1219500315037",
        type: "Number" as const,
        decimalPlaces: 15,
      },
      {
        name: "zoom",
        label: "Zoom",
        placeholder: "15",
        type: "Number" as const,
      },
      {
        name: "markers",
        label: "Markers",
        type: "Text" as const,
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
