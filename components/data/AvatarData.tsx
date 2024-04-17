import { ShowAssetsLink } from "@/components/ShowAssetsLink";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";

export const AvatarData = ({ component, endpoints }: DataProps) => {
  const fieldsGroup = {
    Avatar: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        type: "url" as const,
        additionalComponent: <ShowAssetsLink />,
      },
      {
        name: "children",
        label: "Value",
        // Need a way to add a default value, this doesn't work
        defaultValue: "TM",
      },
    ],
    Image: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        type: "url" as const,
        additionalComponent: <ShowAssetsLink />,
      },
      {
        name: "alt",
        label: "Alternative Text",
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
