import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";

export const useEndpoint = () => {
  const refreshAccessToken = useDataSourceStore(
    (state) => state.refreshAccessToken,
  );
  const accessToken = useDataSourceStore((state) => state.accessToken);
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const apiCall = async (endpointId: string) => {
    try {
      const endpoint = endpoints?.results?.find((e) => e.id === endpointId);

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

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return { apiCall };
};
