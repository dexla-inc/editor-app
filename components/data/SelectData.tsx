import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { useEditorTreeStore } from "@/stores/editorTree";
import { DataProps, DataType } from "@/types/dataBinding";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";

export const SelectData = ({ component, endpoints, dataType }: DataProps) => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  return (
    <Stack spacing="xs">
      <SegmentedControl
        w="100%"
        size="xs"
        value={component.props?.dataType}
        data={[
          { label: "Static", value: "static" },
          { label: "Dynamic", value: "dynamic" },
        ]}
        onChange={(e: DataType) =>
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: { props: { dataType: e } },
          })
        }
      />
      {dataType === "static" && (
        <FormFieldsBuilder
          fields={[
            { name: "data", label: "Options", fieldType: "Options" },
            { name: "value", label: "Value", fieldType: "Text" },
            { name: "placeholder", label: "Placeholder", fieldType: "Text" },
            {
              name: "nothingFound",
              label: "No result message",
              fieldType: "Text",
            },
            {
              name: "validationMessage",
              label: "Validation message",
              fieldType: "Text" as const,
              defaultValue: `${component.description} is required`,
            },
          ]}
          component={component}
          endpoints={endpoints!}
        />
      )}
      {dataType === "dynamic" && (
        <DynamicSettings
          component={component}
          endpoints={endpoints!}
          customProps={{
            dataLabelKey: "name",
            dataValueKey: "id",
          }}
        >
          {({ form, selectableObjectKeys }) => {
            return (
              <Stack spacing="xs" my="xs">
                <Title order={6} mt="xs">
                  Options
                </Title>
                <Text size="xs" color="dimmed">
                  Set up the data structure
                </Text>

                <Select
                  label="Label"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataLabelKey")}
                  searchable
                />
                <Select
                  label="Value"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataValueKey")}
                  searchable
                />
                <Select
                  label="Group"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataGroupKey")}
                  searchable
                  clearable
                />
                <Select
                  label="Description"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataDescriptionKey")}
                  searchable
                  clearable
                />
                <FormFieldsBuilder
                  fields={[
                    {
                      name: "value",
                      label: "Default Value",
                      fieldType: "Text",
                    },
                    {
                      name: "placeholder",
                      label: "Placeholder",
                      fieldType: "Text",
                    },
                    {
                      name: "nothingFound",
                      label: "No result message",
                      fieldType: "Text",
                    },
                  ]}
                  component={component}
                  endpoints={endpoints!}
                />
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
