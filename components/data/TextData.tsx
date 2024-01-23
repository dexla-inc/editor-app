import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { DynamicChildSettings } from "@/components/data/forms/DynamicChildSettings";

export const TextData = ({ component, endpoints, dataType }: DataProps) => {
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";

  const staticFields = [
    {
      name: isNavLink ? "label" : isFileButton ? "name" : "children",
      label: "Value",
    },
  ];

  const dynamicFields = staticFields.map((f) => ({
    ...f,
    name: `${f.name}Key`,
  }));

  console.log(component.parentDataComponentId);

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
