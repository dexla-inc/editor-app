import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { Component } from "@/utils/editor";
import { SegmentedControl, Stack, Text, TextInput, Title } from "@mantine/core";
import { useEditorStore } from "@/stores/editor";
import { jsonStructure as tableCellStructure } from "@/components/mapper/structure/table/TableCell";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

const onSave = (component: Component | undefined, form: any) => {
  const columns = form.values.columns?.split(",");

  if (component?.children?.length !== columns.length) {
    return {
      children: Array(columns.length)
        .fill(0)
        .map(() => tableCellStructure()),
    };
  }
  return {};
};

export const TableData = ({ component, endpoints, dataType }: DataProps) => {
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );

  return (
    <Stack>
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
      {dataType === "static" && <></>}
      {dataType === "dynamic" && (
        <DynamicSettings
          component={component}
          endpoints={endpoints!}
          onSave={onSave}
          customKeys={["columns"]}
        >
          {({ form }) => {
            return (
              <Stack spacing="xs" my="xs">
                <Title order={6} mt="xs">
                  Options
                </Title>
                <Text size="xs" color="dimmed">
                  Set up the data structure
                </Text>
                <TextInput label="Columns" {...form.getInputProps("columns")} />
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
