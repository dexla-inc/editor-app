import { WarningAlert } from "@/components/Alerts";
import { DataSourceListItem } from "@/components/datasources/DataSourceListItem";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import PaneHeading from "@/components/navbar/PaneHeading";
import { getDataSources } from "@/requests/datasources/queries";
import { DataSourceResponse } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const EditorNavbarDataSourcesSection = () => {
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
              It is recommended you change your swagger file and re-import
              in&nbsp;
              <Link
                href="/projects/[id]/settings/datasources"
                as={`/projects/${projectId}/settings/datasources`}
              >
                Datasource settings
              </Link>
              &nbsp;instead of changing your APIs here. This section is for
              mapping values.
            </Text>
          </WarningAlert>
        )}
        {dataSources?.results && dataSources.results.length > 0 ? (
          dataSources.results.map((dataSource) => {
            return (
              <DataSourceListItem
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
