import { Icon } from "@/components/Icon";
import { DataSourceEndpointDetail } from "@/components/datasources/DataSourceEndpointDetail";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { EndpointParams } from "@/requests/datasources/types";
import { Button, Group, Stack } from "@mantine/core";
import { useState } from "react";

export const AddNewDataSourceEndpoint = ({
  baseUrl,
  dataSourceId,
}: {
  baseUrl: string;
  dataSourceId: string;
}) => {
  const emptyEndpoint: EndpointParams = {
    relativeUrl: "",
    methodType: "GET",
    description: null,
    mediaType: "application/json",
    withCredentials: null,
    headers: [],
    parameters: [],
    requestBody: [],
    exampleResponse: "",
    errorExampleResponse: "",
    isServerRequest: false,
    dataSourceId: dataSourceId ?? "",
    baseUrl: baseUrl,
  };

  const addNewEndpoint = () => {
    setEndpoint(emptyEndpoint);
    setEndpointDetailVisible(true);
  };

  const [isEndpointDetailVisible, setEndpointDetailVisible] = useState(false);
  const [endpoint, setEndpoint] = useState(emptyEndpoint);
  const { id: projectId, ...routeParams } = useEditorParams();

  const actualDataSourceId =
    dataSourceId ?? (routeParams.dataSourceId as string);

  emptyEndpoint.dataSourceId = actualDataSourceId;

  return (
    <Stack>
      <Group>
        <Button
          onClick={addNewEndpoint}
          variant="outline"
          leftIcon={<Icon name="IconPlus"></Icon>}
          compact
        >
          Create New Endpoint
        </Button>
      </Group>
      {isEndpointDetailVisible && (
        <DataSourceEndpointDetail
          baseUrl={baseUrl}
          endpoint={endpoint}
          projectId={projectId}
          dataSourceId={dataSourceId}
          setEndpointDetailVisible={setEndpointDetailVisible}
        />
      )}
    </Stack>
  );
};
