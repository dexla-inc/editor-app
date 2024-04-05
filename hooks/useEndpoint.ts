import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { getUrl, performFetch } from "@/utils/actions";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";

type UseEndpointProps = {
  dataType: "static" | "dynamic";
  onLoad?: any;
  forceEnabled?: boolean;
  enabled?: boolean;
  includeExampleResponse?: boolean;
};

export const useEndpoint = ({
  dataType,
  onLoad,
  enabled = true,
  includeExampleResponse = false,
}: UseEndpointProps) => {
  const accessToken = useDataSourceStore(
    (state) => state.authState.accessToken,
  );

  const {
    endpointId,
    resultsKey,
    staleTime = DEFAULT_STALE_TIME,
  } = onLoad ?? {};

  const projectId = useEditorTreeStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const endpoint = endpoints?.results?.find((e) => e.id === endpointId);
  const { binds: { parameter = {}, body = {} } = {} } = useComputeValue2({
    onLoad: { binds: onLoad?.binds },
  });

  const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;

  const requestBody = endpoint ? { ...parameter, ...body } : {};

  const url = endpoint ? getUrl(Object.keys(parameter), apiUrl, parameter) : "";

  const fetchUrl = endpoint?.isServerRequest
    ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
    : url;

  const apiCall = async () => {
    const authHeaderKey = accessToken ? "Bearer " + accessToken : "";

    return performFetch(
      fetchUrl,
      endpoint,
      body,
      authHeaderKey,
      includeExampleResponse,
    ).then((response) => {
      return response;
    });
  };

  const isEnabled = !!endpoint && dataType === "dynamic" && enabled;

  const { data, isLoading } = useQuery(
    [fetchUrl, JSON.stringify(requestBody), accessToken],
    apiCall,
    {
      select: (response) => {
        return get(response, resultsKey, response);
      },
      staleTime: staleTime * 1000 * 60,
      enabled: isEnabled,
    },
  );

  return { data, isLoading: isLoading && isEnabled };
};
