import { WarningAlert } from "@/components/Alerts";
import { DataSourceListItem } from "@/components/datasources/DataSourceListItem";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import PaneHeading from "@/components/navbar/PaneHeading";
import { getDataSources } from "@/requests/datasources/queries-noauth";
import { Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";

type EditorNavbarDataSourcesSectionProps = {
  isActive: boolean;
};

export const EditorNavbarDataSourcesSection = ({
  isActive,
}: EditorNavbarDataSourcesSectionProps) => {
  const router = useRouter();
  const projectId = router.query.id as string;

  const dataSources = useQuery({
    queryKey: ["datasources"],
    queryFn: () => getDataSources(projectId, {}),
    enabled: !!projectId && isActive,
  });

  return (
    <>
      <PaneHeading
        text={"Data Source"}
        dataSourceType={"API"}
        showBackButton={true}
        onBack={() => true}
        onClose={() => true}
      ></PaneHeading>
      <Stack>
        {dataSources?.data?.results && dataSources.data.results.length > 0 && (
          <WarningAlert isHtml>
            <Text>
              It is recommended you change configuration in your swagger file
              and refetch the latest changes in&nbsp;
              <Link
                href="/projects/[id]/settings/datasources"
                as={`/projects/${projectId}/settings/datasources`}
              >
                Datasource settings
              </Link>
              .
            </Text>
          </WarningAlert>
        )}
        {dataSources?.data?.results && dataSources.data.results.length > 0 ? (
          dataSources.data.results.map((dataSource) => {
            return (
              <DataSourceListItem
                baseUrl={dataSource.baseUrl}
                key={dataSource.id}
                projectId={projectId}
                id={dataSource.id}
                name={dataSource.name}
              ></DataSourceListItem>
            );
          })
        ) : (
          <EmptyDatasourcesPlaceholder
            projectId={projectId}
          ></EmptyDatasourcesPlaceholder>
        )}
      </Stack>
    </>
  );
};
