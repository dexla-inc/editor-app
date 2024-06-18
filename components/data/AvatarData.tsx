import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/types/dataBinding";
import { Stack } from "@mantine/core";

export const AvatarData = ({ component, endpoints }: DataProps) => {
  const fieldsGroup = {
    Avatar: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        fieldType: "Text" as const,
        type: "url",
      },
      {
        name: "children",
        label: "Value",
        fieldType: "Text" as const,
      },
    ],
    Image: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        fieldType: "Text" as const,
        type: "url",
      },
      {
        name: "alt",
        label: "Alternative Text",
        fieldType: "Text" as const,
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
