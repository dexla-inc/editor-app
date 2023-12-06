import { AddNewDataSourceEndpoint } from "@/components/datasources/AddNewDataSourceEndpoint";
import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

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
  const endpoints = useQuery({
    queryKey: ["endpoints"],
    queryFn: () => getDataSourceEndpoints(projectId, { dataSourceId }),
    enabled: !!projectId,
  });

  return (
    <>
      <Title order={5}>API Endpoints</Title>
      <AddNewDataSourceEndpoint baseUrl={baseUrl} dataSourceId={dataSourceId} />
      {endpoints.data?.results.map((endpoint) => {
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
