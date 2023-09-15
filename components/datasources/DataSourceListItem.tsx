import { DataSourceEndpoint } from "@/components/datasources/DataSourceEndpoint";
import { getDataSourceEndpoints } from "@/requests/datasources/queries";
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
  let initialBody = {
    results: [],
    paging: {
      totalRecords: 0,
      recordsPerPage: 0,
      page: 0,
    },
    trackingId: "",
  };

  const [endpoints, setEndpoints] =
    useState<PagingResponse<Endpoint>>(initialBody);
  const [showEndpoints, setShowEndpoints] = useState<boolean>(false);

  const onClick = async () => {
    const result = await getDataSourceEndpoints(projectId, id);
    setEndpoints(result);
    setShowEndpoints(result.results.length > 0);
  };

  return (
    <Stack>
      <Button onClick={onClick} variant="default">
        {name}
      </Button>
      <Stack>
        {endpoints.results.map((endpoint) => {
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
