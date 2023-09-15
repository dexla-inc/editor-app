import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AddNewDataSourceEndpoint } from "./AddNewDataSourceEndpoint";

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
      <AddNewDataSourceEndpoint baseUrl={baseUrl} />
      {endpoints.data?.results.map((endpoint) => {
        return (
          <DataSourceEndpoint
            baseUrl={baseUrl}
            key={endpoint.id}
            projectId={projectId}
            endpoint={endpoint}
            location="datasource"
          ></DataSourceEndpoint>
        );
      })}
    </>
  );
};
