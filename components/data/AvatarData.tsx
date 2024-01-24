import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { DynamicChildSettings } from "@/components/data/forms/DynamicChildSettings";
import { ShowAssetsLink } from "@/components/ShowAssetsLink";

export const AvatarData = ({ component, endpoints, dataType }: DataProps) => {
  const staticFieldsGroup = {
    Avatar: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        type: "url",
        additionalComponent: <ShowAssetsLink />,
      },
      {
        name: "children",
        label: "Value",
      },
    ],
    Image: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        type: "url",
        additionalComponent: <ShowAssetsLink />,
      },
      {
        name: "alt",
        label: "Alternative Text",
      },
    ],
  };
  const componentName = component.name as keyof typeof staticFieldsGroup;
  const staticFields = staticFieldsGroup[componentName];
  const dynamicFields = staticFields.map((f) => ({
    ...f,
    name: `${f.name}Key`,
  }));

  return (
    <Stack spacing="xs">
      {dataType === "static" && (
        <StaticFormFieldsBuilder fields={staticFields} component={component} />
      )}

      {dataType === "dynamic" && (
        <DynamicChildSettings
          component={component}
          endpoints={endpoints!}
          customKeys={dynamicFields.map((f) => f.name)}
        >
          {({ form, selectableObjectKeys }) => (
            <DynamicFormFieldsBuilder
              form={form}
              component={component}
              fields={dynamicFields}
              selectableObjectKeys={selectableObjectKeys}
            />
          )}
        </DynamicChildSettings>
      )}
    </Stack>
  );
};
