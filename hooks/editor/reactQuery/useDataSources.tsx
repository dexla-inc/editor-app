import { getDataSources } from "@/requests/datasources/queries-noauth";
import { DataSourceResponse } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useDataSources = (
  projectId: string,
  include: string = "endpoints,auth",
  datasourceId?: string,
) => {
  const queryKey = ["datasources", projectId, include, datasourceId];

  const queryResult = useQuery<PagingResponse<DataSourceResponse>, Error>({
    queryKey: queryKey,
    queryFn: () => getDataSources(projectId, { include, datasourceId }),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
