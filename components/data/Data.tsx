import { useEditorTreeStore } from "@/stores/editorTree";
import { dataMapper } from "@/utils/dataMapper";
import { Stack } from "@mantine/core";
import { useShallow } from "zustand/react/shallow";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";
import { DataType } from "@/types/dataBinding";

export const Data = () => {
  const component = useEditorTreeStore(
    useShallow((state) => {
      const selectedComponentId = selectedComponentIdSelector(state);
      return state.componentMutableAttrs[selectedComponentId!];
    }),
  );
  const projectId = useEditorTreeStore((state) => state.currentProjectId);
  const { endpoints } = useEndpoints(projectId as string);

  const DataSection = dataMapper[component?.name as keyof typeof dataMapper];

  if (!DataSection) {
    return null;
  }

  return (
    <Stack px="md">
      <DataSection
        fields={[]}
        component={component}
        endpoints={endpoints}
        dataType={component.props?.dataType ?? DataType.static}
      />
    </Stack>
  );
};
