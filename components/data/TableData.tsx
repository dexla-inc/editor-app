import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { jsonStructure as textStructure } from "@/components/mapper/structure/Text";
import { jsonStructure as tableCellStructure } from "@/components/mapper/structure/table/TableCell";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import {
  Component,
  debouncedTreeComponentChildrenUpdate,
} from "@/utils/editor";
import { Box, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import { TableColumnItemsDraggable } from "./forms/TableColumnItemsDraggable";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

const onSave = async (component: Component | undefined, form: any) => {
  const columns = form.values.onLoad.columns?.split(",");

  if (component?.children?.length !== columns.length) {
    return await debouncedTreeComponentChildrenUpdate(
      Array(columns.length)
        .fill(0)
        .map(() => tableCellStructure({ children: [textStructure()] })),
    );
  }
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
          {({
            form,
            selectableObjectKeys,
          }: {
            form: any;
            selectableObjectKeys: string[];
          }) => {
            return (
              <Stack spacing="xs" my="xs">
                <Box>
                  <Title order={6} mt="xs">
                    Table display
                  </Title>
                  <Text size="xs" color="dimmed">
                    Set up the data structure
                  </Text>
                </Box>
                <TableColumnItemsDraggable
                  selectableObjectKeys={selectableObjectKeys}
                />
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
