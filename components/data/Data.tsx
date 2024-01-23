import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useEditorStore } from "@/stores/editor";
import { dataMapper } from "@/utils/dataMapper";
import { Component } from "@/utils/editor";
import { SegmentedControl, Stack } from "@mantine/core";

type DataProps = {
  component: Component;
};
export const Data = ({ component }: DataProps) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const DataSection = dataMapper[component?.name as keyof typeof dataMapper];

  if (!DataSection) {
    return null;
  }

  return (
    <Stack px="md">
      {component.props?.dataType && (
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
      )}
      <DataSection
        component={component}
        endpoints={endpoints}
        dataType={component.props?.dataType}
      />
    </Stack>
  );
};
