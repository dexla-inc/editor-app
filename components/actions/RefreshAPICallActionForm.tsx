import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { EndpointSelect } from "@/components/EndpointSelect";
import { ActionFormProps, RefreshAPICallAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

type Props = ActionFormProps<Omit<RefreshAPICallAction, "name">>;

export const RefreshAPICallActionForm = ({ form }: Props) => {
  const { id: projectId } = useEditorParams();

  const { endpoints } = useEndpoints(projectId as string);

  return endpoints && endpoints.length > 0 ? (
    <>
      <Stack spacing="xs">
        <EndpointSelect {...form.getInputProps("endpoint")} isOnLoad />
      </Stack>
    </>
  ) : (
    <EmptyDatasourcesPlaceholder projectId={projectId} />
  );
};
