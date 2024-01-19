import { SegmentedControl, Stack } from "@mantine/core";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { dataMapper } from "@/utils/dataMapper";
import { ReactNode } from "react";
import { useEditorStore } from "@/stores/editor";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";

type DataProps = {
  component: Component;
};
export const Data = ({ component }: DataProps) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  const DataSection = dataMapper[component?.name as keyof typeof dataMapper];

  if (!DataSection) {
    return null;
  }

  return (
    <Stack px="md">
      <SegmentedControl
        w="100%"
        size="xs"
        data={[
          { label: "Static", value: "static" },
          { label: "Dynamic", value: "dynamic" },
        ]}
        onChange={(e) =>
          debouncedTreeComponentAttrsUpdate({ props: { dataType: e } })
        }
      />
      <DataSection
        component={component}
        endpoints={endpoints}
        dataType={component.props?.dataType}
      />
    </Stack>
  );
};
