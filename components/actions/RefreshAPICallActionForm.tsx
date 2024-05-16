import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import { EndpointSelect } from "@/components/EndpointSelect";
import { ActionFormProps, RefreshAPICallAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";

type Props = ActionFormProps<Omit<RefreshAPICallAction, "name">>;

export const RefreshAPICallActionForm = ({ form }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;

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
