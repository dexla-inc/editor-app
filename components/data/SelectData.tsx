import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorTreeStore } from "@/stores/editorTree";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";
import { DataProps, DataType } from "@/types/dataBinding";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { BindingField } from "@/components/editor/BindingField/BindingField";

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
                <BindingField
                  form={form}
                  field={{
                    name: "value",
                    label: "Default Value",
                    fieldType: "Text",
                  }}
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
