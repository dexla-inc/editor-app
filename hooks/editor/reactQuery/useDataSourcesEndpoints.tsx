import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { useMemo } from "react";

export const useEndpoints = (projectId: string, datasourceId?: string) => {
  const {
    data: datasources,
    isLoading,
    error,
    isFetched,
    invalidate,
  } = useDataSources(projectId, "endpoints,auth", datasourceId);

  const endpoints = useMemo(() => {
    return datasources?.results.flatMap((ds) => ds.endpoints || []) || [];
  }, [datasources]);

  return { endpoints, isLoading, error, isFetched, invalidate };
};
