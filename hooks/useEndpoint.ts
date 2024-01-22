import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { performFetch, prepareRequestData } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";

type UseEndpointProps = {
  endpointId: string;
  requestSettings: any;
};

export const useEndpoint = ({
  endpointId = "",
  requestSettings = { binds: {}, dataType: "", staleTime: 0 },
}: UseEndpointProps) => {
  const accessToken = useDataSourceStore(
    (state) => state.authState.accessToken,
  );
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const endpoint = endpoints?.results?.find((e) => e.id === endpointId);
  const { url, body } = prepareRequestData(requestSettings, endpoint!);

  const apiCall = () => {
    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const authHeaderKey =
      endpoint?.authenticationScheme === "BEARER"
        ? "Bearer " + accessToken
        : "";

    const fetchUrl = endpoint?.isServerRequest
      ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
      : url;

    return performFetch(fetchUrl, endpoint, body, authHeaderKey);
  };

  return useQuery([url, JSON.stringify(body), accessToken], apiCall, {
    staleTime: Number(requestSettings.staleTime) * 1000 * 60,
    enabled: !!endpoint && requestSettings.dataType === "dynamic",
  });
};
