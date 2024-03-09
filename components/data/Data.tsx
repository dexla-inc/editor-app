import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useEditorTreeStore } from "@/stores/editorTree";
import { dataMapper } from "@/utils/dataMapper";
import { Stack } from "@mantine/core";

export const Data = () => {
  const selectedComponentIds = ["main-content"];
  console.log("ComponentToolbox3");
  const component = useEditorTreeStore(
    (state) => state.componentMutableAttrs[selectedComponentIds?.at(-1)!],
  );
  const projectId = useEditorTreeStore((state) => state.currentProjectId);
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
