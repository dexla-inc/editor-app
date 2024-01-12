import { AddNewDataSourceEndpoint } from "@/components/datasources/AddNewDataSourceEndpoint";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { Title } from "@mantine/core";

type DataSourceEndpointListProps = {
  projectId: string;
  dataSourceId: string;
  baseUrl: string;
};

export const DataSourceEndpointList = ({
  projectId,
  dataSourceId,
  baseUrl,
}: DataSourceEndpointListProps) => {
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  return (
    <>
      <Title order={5}>API Endpoints</Title>
      <AddNewDataSourceEndpoint baseUrl={baseUrl} dataSourceId={dataSourceId} />
      {endpoints?.results.map((endpoint) => {
        return (
          <DataSourceEndpoint
            baseUrl={baseUrl}
            key={endpoint.id}
            projectId={projectId}
            endpoint={endpoint}
            location="datasource"
            dataSourceId={dataSourceId}
          ></DataSourceEndpoint>
        );
      })}
    </>
  );
};
