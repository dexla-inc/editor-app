import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
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
  const [endpoints, setEndpoints] = useState<Endpoint[]>();
  const { data } = useDataSourceEndpoints(projectId);

  const onClick = async () => {
    const result = data?.results.filter((d) => d.id === id);
    setEndpoints(result);
  };

  return (
    <Stack>
      <Button onClick={onClick} variant="default">
        {name}
      </Button>
      <Stack>
        {endpoints?.map((endpoint) => {
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
