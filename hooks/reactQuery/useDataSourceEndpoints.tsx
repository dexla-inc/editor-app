import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useDataSourceEndpoints = (projectId?: string) => {
  console.log("useDataSourceEndpoints", projectId);
  const queryKey = ["endpoints", projectId];

  const queryResult = useQuery<PagingResponse<Endpoint>, Error>({
    queryKey: queryKey,
    queryFn: () => getDataSourceEndpoints(projectId as string),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
