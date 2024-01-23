import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { DynamicChildSettings } from "@/components/data/forms/DynamicChildSettings";

export const AvatarData = ({ component, endpoints, dataType }: DataProps) => {
  const staticFieldsGroup = {
    Avatar: [
      {
        name: "src",
        label: "Source",
        placeholder: "https://example.com/image.png",
        type: "url",
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

  const DynamicSettingsWrapper = !component.parentDataComponentId
    ? DynamicSettings
    : DynamicChildSettings;

  return (
    <Stack spacing="xs">
      {dataType === "static" && (
        <StaticFormFieldsBuilder fields={staticFields} component={component} />
      )}

      {dataType === "dynamic" && (
        <DynamicSettingsWrapper
          component={component}
          endpoints={endpoints!}
          customKeys={dynamicFields.map((f) => f.name)}
        >
          {({ form, selectableObjectKeys }) => (
            <DynamicFormFieldsBuilder
              form={form}
              fields={dynamicFields}
              selectableObjectKeys={selectableObjectKeys}
            />
          )}
        </DynamicSettingsWrapper>
      )}
    </Stack>
  );
};
