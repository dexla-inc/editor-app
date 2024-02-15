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
import { SegmentedControl, Stack } from "@mantine/core";
import { TableDataForm } from "./forms/TableDataForm";

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
          {({ form, selectableObjectKeys }) => {
            return (
              <TableDataForm
                form={form}
                selectableObjectKeys={selectableObjectKeys}
              />
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
