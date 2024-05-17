import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { getUrl, performFetch } from "@/utils/actions";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";
import { DataType } from "@/types/dataBinding";
import { removeEmpty, toBase64 } from "@/utils/common";
import { useEndpoints } from "../editor/reactQuery/useDataSourcesEndpoints";

type UseEndpointProps = {
  dataType: DataType;
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
  const authState = useDataSourceStore((state) => state.getAuthState);

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
  const requestBody = endpoint ? { ...parameter, ...body } : {};
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
      endpoint,
      headers,
      body,
      authHeaderKey,
      includeExampleResponse,
    ).then((response) => {
      return response;
    });
  };

  const isEnabled = !!endpoint && dataType === "dynamic" && enabled;

  const { data, isLoading } = useQuery(
    [endpointId, fetchUrl, accessToken, headers, cleanParameter, body],
    apiCall,
    {
      select: (response) => {
        return get(response, resultsKey, response);
      },
      staleTime: staleTime * 1000 * 60,
      enabled: isEnabled,
      networkMode: "offlineFirst",
      retry: false,
    },
  );

  return {
    data,
    isLoading: isLoading && isEnabled,
    initiallyLoading: isLoading && isEnabled,
  };
};
