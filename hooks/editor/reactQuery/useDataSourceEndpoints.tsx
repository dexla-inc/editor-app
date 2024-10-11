import { getDataSourceEndpoints } from "@/requests/datasources/queries";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { queryClient } from "@/utils/reactQuery";
import { useQuery } from "@tanstack/react-query";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useDataSourceEndpoints = (
  projectId?: string,
  dataSourceId?: string,
) => {
  const queryKey = ["endpoints", projectId, dataSourceId];

  const queryResult = useQuery<PagingResponse<Endpoint>, Error>({
    queryKey: queryKey,
    queryFn: () =>
      getDataSourceEndpoints(projectId as string, {
        dataSourceId: dataSourceId,
      }),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
