import { Icon } from "@/components/Icon";
import { Endpoint } from "@/requests/datasources/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useFetchedDataStore } from "@/stores/fetchedData";
import { GREEN_COLOR } from "@/utils/branding";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  endpoint?: Endpoint;
  projectId?: string;
};

export const EndpointExampleResponseTest = ({ endpoint, projectId }: Props) => {
  const [isLoading, { open: onLoading, close: offLoading }] =
    useDisclosure(false);
  const refreshAccessToken = useDataSourceStore(
    (state) => state.refreshAccessToken,
  );
  const accessToken = useDataSourceStore((state) => state.accessToken);
  const setDataResponse = useFetchedDataStore((state) => state.setDataResponse);

  const handleTestEndpoint = async () => {
    try {
      onLoading();
      refreshAccessToken();
      const authHeaderKey =
        endpoint?.authenticationScheme === "BEARER"
          ? "Bearer " + accessToken
          : "";

      // Prepare request headers
      const requestHeaders: Record<string, string> = {
        "Content-Type": endpoint?.mediaType!,
        Accept: "*/*",
      };

      for (const header of endpoint?.headers ?? []) {
        if (header.value !== null) {
          requestHeaders[header.name] = header.value.toString();
        }
        if (header.name === "Authorization" && header.type === "BEARER") {
          requestHeaders[header.name] = authHeaderKey;
        }
      }
      const response = await fetch(endpoint?.url ?? "", {
        method: endpoint?.methodType,
        headers: requestHeaders,
        ...(endpoint?.body ? { body: endpoint.body } : {}),
      });
      // Check response status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Set exampleResponse for successful response
      setDataResponse(endpoint?.id!, "exampleResponse", JSON.stringify(data));
    } catch (error) {
      console.log(error);
      setDataResponse(
        endpoint?.id!,
        "errorExampleResponse",
        JSON.stringify(error),
      );
    } finally {
      offLoading();
    }
  };
  return (
    endpoint && (
      <Button
        onClick={handleTestEndpoint}
        color={GREEN_COLOR}
        size="xs"
        leftIcon={<Icon name="IconClick" />}
        loading={isLoading}
      >
        Test
      </Button>
    )
  );
};
