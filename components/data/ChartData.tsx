import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component } from "@/utils/editor";
import { SegmentedControl, Stack } from "@mantine/core";
import { ChartForm } from "@/components/data/forms/static/ChartForm";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

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
        onChange={(e) =>
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: {
              props: { dataType: e },
            },
          })
        }
      />
      {dataType === "static" && <ChartForm component={component} />}
      {dataType === "dynamic" && (
        <DynamicSettings component={component} endpoints={endpoints!} />
      )}
    </Stack>
  );
};
