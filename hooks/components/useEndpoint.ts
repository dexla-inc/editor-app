import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { getUrl } from "@/utils/actionsApi";
import { performFetch } from "@/utils/actionsApi";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";
import { DataType } from "@/types/dataBinding";
import { removeEmpty, toBase64 } from "@/utils/common";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";

type UseEndpointProps = {
  componentId: string;
  dataType: DataType;
  onLoad?: any;
  forceEnabled?: boolean;
  enabled?: boolean;
};

export const useEndpoint = ({
  componentId,
  dataType,
  onLoad,
  enabled = true,
}: UseEndpointProps) => {
  const authState = useDataSourceStore((state) => state.getAuthState);
  const setRelatedComponentsData = useEditorTreeStore(
    (state) => state.setRelatedComponentsData,
  );

  const {
    endpointId,
    resultsKey,
    staleTime = DEFAULT_STALE_TIME,
    binds: { parameter = {}, header = {}, body = {} } = {},
  } = onLoad ?? {};

  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const { endpoints } = useEndpoints(projectId as string);
  const endpoint = endpoints?.find((e) => e.id === endpointId);
  const accessToken = authState(projectId)?.accessToken;
  const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;
  const headers = endpoint ? { ...header } : {};
  const cleanParameter = removeEmpty(parameter);
  const url = endpoint
    ? getUrl(Object.keys(cleanParameter), apiUrl, cleanParameter)
    : "";
  const fetchUrl = endpoint?.isServerRequest
    ? `/api/proxy?targetUrl=${toBase64(url)}`
    : url;

  const apiCall = async () => {
    const authHeaderKey = accessToken ? "Bearer " + accessToken : "";

    const refreshAccessToken = useDataSourceStore.getState().refreshAccessToken;

    refreshAccessToken(projectId, endpoint?.dataSourceId as string);

    return performFetch(
      fetchUrl,
      endpoint?.methodType,
      headers,
      body,
      endpoint?.mediaType,
      authHeaderKey,
    ).then((response) => {
      setRelatedComponentsData({ id: componentId, data: response });

      return response;
    });
  };

  const isEnabled = !!endpoint && dataType === "dynamic" && enabled;

  const { data, isLoading } = useQuery({
    queryKey: [
      endpointId,
      fetchUrl,
      accessToken,
      headers,
      cleanParameter,
      body,
    ],
    queryFn: apiCall,
    ...{
      select: (response) => {
        return get(response, resultsKey, response);
      },
      staleTime: staleTime * 1000 * 60,
      enabled: isEnabled,
      networkMode: "offlineFirst",
      retry: false,
    },
  });

  return {
    data,
    isLoading: isLoading && isEnabled,
    initiallyLoading: isLoading && isEnabled,
  };
};
