import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

type DataSourceEndpointListProps = {
  projectId: string;
  dataSourceId: string;
};

export const DataSourceEndpointList = ({
  projectId,
  dataSourceId,
}: DataSourceEndpointListProps) => {
  const endpoints = useQuery({
    queryKey: ["endpoints"],
    queryFn: () => getDataSourceEndpoints(projectId, dataSourceId),
    enabled: !!projectId,
  });

  return (
    <>
      <Title order={5}>API Endpoints</Title>
      {endpoints.data?.results.map((endpoint) => {
        return (
          <DataSourceEndpoint
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
