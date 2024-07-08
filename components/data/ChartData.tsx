import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorTreeStore } from "@/stores/editorTree";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";
import { DataProps } from "@/types/dataBinding";
import { DataType } from "@/types/dataBinding";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const ChartData = ({ component, endpoints, dataType }: DataProps) => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const isPieOrRadial =
    component?.name === "PieChart" || component?.name === "RadialChart";

  const specialData = isPieOrRadial
    ? { name: "options.labels", label: "Data Labels" }
    : { name: "options.xaxis.categories", label: "Data (x-axis)" };
  const staticFields = [
    {
      ...specialData,
      fieldType: "TextArea" as const,
    },
    {
      name: "series",
      label: "Data",
      fieldType: "TextArea" as const,
    },
  ];

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
            attrs: {
              props: { dataType: e },
            },
          })
        }
      />
      {dataType === "static" && (
        <FormFieldsBuilder
          component={component}
          fields={staticFields}
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
                />
                <Select
                  label="Series"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataSeriesKey")}
                />
                <Select
                  label="Legend"
                  data={selectableObjectKeys}
                  {...form.getInputProps("onLoad.dataLegendKey")}
                />
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
