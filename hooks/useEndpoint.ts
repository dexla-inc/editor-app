import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { performFetch, prepareRequestData } from "@/utils/actions";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";
import { Component } from "@/utils/editor";
import { useEffect, useState } from "react";
import get from "lodash.get";
import { useDataContext } from "@/contexts/DataProvider";

type UseEndpointProps = {
  component: Component;
};

export const useEndpoint = ({ component }: UseEndpointProps) => {
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

  const requestSettings = { binds, dataType, staleTime };

  const { url, body } = prepareRequestData(
    requestSettings,
    endpoint!,
    computeValue,
  );

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

  const isEnabled = !!endpoint && dataType === "dynamic";

  const { data } = useQuery([url, JSON.stringify(body), accessToken], apiCall, {
    select: (response) => {
      return get(response, resultsKey, response);
    },
    staleTime: requestSettings.staleTime * 1000 * 60,
    enabled: isEnabled,
  });

  return { data };
};
