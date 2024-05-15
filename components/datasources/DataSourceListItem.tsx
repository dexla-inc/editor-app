import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { useEndpoints } from "@/hooks/reactQuery/useDataSourcesEndpoints";
import { Endpoint } from "@/requests/datasources/types";
import { Button, Stack } from "@mantine/core";
import { useState } from "react";

type DataSourceItemProps = {
  projectId: string;
  name: string;
  id: string;
  baseUrl: string;
};

export const DataSourceListItem = ({
  projectId,
  name,
  id,
  baseUrl,
}: DataSourceItemProps) => {
  const [dataSourceEndpoints, setEndpoints] = useState<Endpoint[]>();
  const { endpoints } = useEndpoints(projectId, id);

  const onClick = async () => {
    const result = endpoints.filter((d) => d.id === id);
    setEndpoints(result);
  };

  return (
    <Stack>
      <Button onClick={onClick} variant="default">
        {name}
      </Button>
      <Stack>
        {dataSourceEndpoints?.map((endpoint) => {
          return (
            <DataSourceEndpoint
              baseUrl={baseUrl}
              key={endpoint.id}
              endpoint={endpoint}
              projectId={projectId}
              location="editor"
            ></DataSourceEndpoint>
          );
        })}
      </Stack>
    </Stack>
  );
};
