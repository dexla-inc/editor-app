import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorTreeStore } from "@/stores/editorTree";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";
import { DataProps, DataType } from "@/types/dataBinding";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

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
            { name: "data", label: "Options", type: "options" },
            { name: "value", label: "Value", type: "text" },
            { name: "placeholder", label: "Placeholder", type: "text" },
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
                <FormFieldsBuilder
                  fields={[
                    { name: "value", label: "Default Value", type: "text" },
                    { name: "placeholder", label: "Placeholder", type: "text" },
                  ]}
                  component={component}
                  endpoints={endpoints!}
                />
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
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
