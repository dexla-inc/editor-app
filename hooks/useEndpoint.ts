import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { performFetch, prepareRequestData } from "@/utils/actions";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";

type UseEndpointProps = {
  endpointId: string;
  requestSettings: any;
};

export const useEndpoint = ({
  endpointId = "",
  requestSettings = { binds: {}, dataType: "", staleTime: DEFAULT_STALE_TIME },
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

  const isEnabled = !!endpoint && requestSettings.dataType === "dynamic";

  return useQuery([url, JSON.stringify(body), accessToken], apiCall, {
    staleTime: requestSettings.staleTime * 1000 * 60,
    enabled: isEnabled,
  });
};
