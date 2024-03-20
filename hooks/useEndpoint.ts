import { useDataContext } from "@/contexts/DataProvider";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorTreeStore } from "@/stores/editorTree";
import { performFetch, prepareRequestData } from "@/utils/actions";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { Component } from "@/utils/editor";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";

type UseEndpointProps = {
  component: Component;
  forceEnabled?: boolean;
  enabled?: boolean;
  includeExampleResponse?: boolean;
};

export const useEndpoint = ({
  component,
  enabled = true,
  includeExampleResponse = false,
}: UseEndpointProps) => {
  const accessToken = useDataSourceStore(
    (state) => state.authState.accessToken,
  );

  const { dataType } = component.props as any;
  const {
    endpointId,
    resultsKey,
    binds,
    staleTime = DEFAULT_STALE_TIME,
  } = component.onLoad ?? {};

  const projectId = useEditorTreeStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const endpoint = endpoints?.results?.find((e) => e.id === endpointId);
  const { computeValue } = useDataContext()!;

  const requestSettings = { binds, dataType, staleTime };

  const { url, body } = prepareRequestData(
    requestSettings,
    endpoint!,
    computeValue,
  );

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
  console.log("-->", fetchUrl, JSON.stringify(body));
  const { data, isLoading } = useQuery(
    [fetchUrl, JSON.stringify(body), accessToken],
    apiCall,
    {
      select: (response) => {
        return get(response, resultsKey, response);
      },
      staleTime: requestSettings.staleTime * 1000 * 60,
      enabled: isEnabled,
    },
  );

  return { data, isLoading: isLoading && isEnabled };
};
