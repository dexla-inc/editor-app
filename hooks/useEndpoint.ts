import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { performFetch, prepareRequestData } from "@/utils/actions";

export const useEndpoint = () => {
  const refreshAccessToken = useDataSourceStore(
    (state) => state.refreshAccessToken,
  );
  const accessToken = useDataSourceStore((state) => state.accessToken);
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const apiCall = async (endpointId: string, requestSettings: any) => {
    try {
      const endpoint = endpoints?.results?.find((e) => e.id === endpointId);
      const { url, body } = await prepareRequestData(
        requestSettings,
        endpoint!,
      );

      refreshAccessToken();
      const authHeaderKey =
        endpoint?.authenticationScheme === "BEARER"
          ? "Bearer " + accessToken
          : "";

      const fetchUrl = endpoint?.isServerRequest
        ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
        : url;

      return await performFetch(fetchUrl, endpoint, body, authHeaderKey);
    } catch (error) {
      console.log(error);
    }
  };

  return { apiCall };
};
