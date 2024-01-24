import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { Component } from "@/utils/editor";
import { SegmentedControl, Stack } from "@mantine/core";
import { useEditorStore } from "@/stores/editor";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

export const ChartData = ({ component, endpoints, dataType }: DataProps) => {
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
      {dataType === "static" && <></>}
      {dataType === "dynamic" && (
        <DynamicSettings component={component} endpoints={endpoints!} />
      )}
    </Stack>
  );
};
