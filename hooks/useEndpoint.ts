import { useDataContext } from "@/contexts/DataProvider";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { performFetch, prepareRequestData } from "@/utils/actions";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { Component } from "@/utils/editor";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";

type UseEndpointProps = {
  component: Component;
  forceEnabled?: boolean;
  enabled?: boolean;
};

const setLoadingState = (
  componentId: string,
  isLoading: boolean,
  updateTreeComponent: Function,
) => {
  updateTreeComponent({ componentId, props: { loading: isLoading } });
};

export const useEndpoint = ({
  component,
  forceEnabled,
  enabled = true,
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

  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const endpoint = endpoints?.results?.find((e) => e.id === endpointId);
  const { computeValue } = useDataContext()!;
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

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
    setLoadingState(component.id!, true, updateTreeComponent);

    const authHeaderKey =
      endpoint?.authenticationScheme === "BEARER"
        ? "Bearer " + accessToken
        : "";

    return performFetch(fetchUrl, endpoint, body, authHeaderKey)
      .then((response) => {
        return response;
      })
      .finally(() => {
        setLoadingState(component.id!, false, updateTreeComponent);
      });
  };

  const isEnabled =
    forceEnabled || (!!endpoint && dataType === "dynamic" && enabled);

  const { data } = useQuery(
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

  return { data };
};
