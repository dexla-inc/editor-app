import { SelectOptionsForm } from "@/components/data/forms/static/SelectOptionsForm";
import { Endpoint } from "@/requests/datasources/types";
import { Component } from "@/utils/editor";
import { SegmentedControl, Select, Stack, Text, Title } from "@mantine/core";
import { PagingResponse } from "@/requests/types";
import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorStore } from "@/stores/editor";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

export const SelectData = ({ component, endpoints, dataType }: DataProps) => {
  const updateTreeComponentAttrs = useEditorStore(
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
        onChange={(e) =>
          updateTreeComponentAttrs([component.id!], {
            props: { dataType: e },
          })
        }
      />
      {dataType === "static" && <SelectOptionsForm component={component} />}
      {dataType === "dynamic" && (
        <DynamicSettings
          component={component}
          endpoints={endpoints!}
          customKeys={["dataLabelKey", "dataValueKey"]}
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
                  {...form.getInputProps("dataLabelKey")}
                />
                <Select
                  label="Value"
                  data={selectableObjectKeys}
                  {...form.getInputProps("dataValueKey")}
                />
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
