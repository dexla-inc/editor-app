import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorTreeStore } from "@/stores/editorTree";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";
import { ChartForm } from "@/components/data/forms/static/ChartForm";
import { DataProps } from "@/types/dataBinding";
import { DataType } from "@/types/dataBinding";

export const ChartData = ({ component, endpoints, dataType }: DataProps) => {
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
            attrs: {
              props: { dataType: e },
            },
          })
        }
      />
      {dataType === "static" && (
        <ChartForm component={component} endpoints={endpoints} />
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
