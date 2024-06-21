import { WarningAlert } from "@/components/Alerts";
import EmptyDatasourcesPlaceholder from "@/components/datasources/EmptyDatasourcesPlaceholder";
import PaneHeading from "@/components/navbar/PaneHeading";
import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { DataSourceResponse } from "@/requests/datasources/types";
import { Select, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataSourceForm } from "../datasources/DataSourceForm";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

export const EditorNavbarDataSourcesSection = () => {
  const { id: projectId } = useEditorParams();

  const [datasourceId, setDatasourceId] = useState<string>();
  const [datasource, setDatasource] = useState<DataSourceResponse>();

  const { data: dataSources } = useDataSources(projectId);

  const onNameChange = (value: string) => {
    const datasource = dataSources?.results.find((ds) => ds.id === value);
    setDatasource(datasource);
    setDatasourceId(value);
  };

  useEffect(() => {
    // auto select the first option in dataSources
    if (dataSources?.results && dataSources.results.length > 0) {
      setDatasourceId(dataSources.results[0].id);
      setDatasource(dataSources.results[0]);
    }
  }, [dataSources?.results]);

  return (
    <Stack p="xs" pr={0} spacing={0}>
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
            <Text size="xs">
              It is recommended you change configuration in your swagger file
              and refetch the latest changes in&nbsp;
              <Link
                href="/projects/[id]/settings/datasources"
                as={`/projects/${projectId}/settings/datasources`}
                target="_blank"
              >
                Datasource settings
              </Link>
            </Text>
          </WarningAlert>
        )}

        {dataSources?.results && dataSources.results.length > 0 ? (
          <Stack spacing="md">
            <Select
              label="Name"
              value={datasourceId}
              onChange={(value) => onNameChange(value as string)}
              data={dataSources.results.map((dataSource) => {
                return {
                  value: dataSource.id,
                  label: dataSource.name,
                };
              })}
            />

            {datasource && <DataSourceForm datasource={datasource} />}
          </Stack>
        ) : (
          <EmptyDatasourcesPlaceholder
            projectId={projectId}
          ></EmptyDatasourcesPlaceholder>
        )}
      </Stack>
    </Stack>
  );
};
