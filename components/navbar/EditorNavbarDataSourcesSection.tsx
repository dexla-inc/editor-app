import { WarningAlert } from "@/components/Alerts";
import DatasourceEndpointItem from "@/components/datasources/DatasourceEndpointItem";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import PaneHeading from "@/components/navbar/PaneHeading";
import { getDataSources } from "@/requests/datasources/queries";
import { DataSourceResponse } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useAppStore } from "@/stores/app";
import { Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const EditorNavbarDataSourcesSection = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const router = useRouter();
  const projectId = router.query.id as string;
  const [dataSources, setDataSources] =
    useState<PagingResponse<DataSourceResponse>>();

  useEffect(() => {
    const fetchDataSources = async () => {
      const fetchedDatasources = await getDataSources(projectId, {});

      setDataSources(fetchedDatasources);
    };

    fetchDataSources();
  }, [projectId]);

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
        {dataSources?.results && dataSources.results.length > 0 && (
          <WarningAlert isHtml>
            <Text>
              It is recommended you change your swagger file and re-import in
              <Link
                href="/projects/[id]/settings/datasources"
                as={`/projects/${projectId}/settings/datasources`}
              >
                Datasource settings&nbsp;
              </Link>
              instead of changing your API here.
            </Text>
          </WarningAlert>
        )}
        {dataSources?.results && dataSources.results.length ? (
          dataSources.results.map((dataSource) => {
            return (
              <DatasourceEndpointItem
                key={dataSource.id}
                projectId={projectId}
              ></DatasourceEndpointItem>
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
