import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorTreeStore } from "@/stores/editorTree";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";
import { DataProps, DataType } from "@/types/dataBinding";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

export const AutocompleteData = ({
  component,
  endpoints,
  dataType,
}: DataProps) => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const { isAdvanced } = useComputeValue({
    onLoad: component?.onLoad ?? {},
  });

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
                <SegmentedControlYesNo
                  label="Advanced"
                  {...form.getInputProps("onLoad.isAdvanced")}
                />
                <Select
                  label="Value"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataValueKey")}
                  searchable
                />
                <Select
                  label="Label"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataLabelKey")}
                  searchable
                />
                {isAdvanced && (
                  <>
                    <Select
                      label="Description"
                      data={selectableObjectKeys}
                      {...form.getInputProps("onLoad.dataDescriptionKey")}
                      searchable
                      clearable
                    />
                    <Select
                      label="Image Url"
                      data={selectableObjectKeys}
                      {...form.getInputProps("onLoad.dataImageKey")}
                      searchable
                      clearable
                    />
                  </>
                )}
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
