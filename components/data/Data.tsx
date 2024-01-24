import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useEditorStore } from "@/stores/editor";
import { dataMapper } from "@/utils/dataMapper";
import { Component } from "@/utils/editor";
import { Stack } from "@mantine/core";

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
      <DataSection
        component={component}
        endpoints={endpoints}
        dataType={component.props?.dataType}
      />
    </Stack>
  );
};
