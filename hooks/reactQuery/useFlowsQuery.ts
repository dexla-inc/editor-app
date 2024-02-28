import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useFlowsQuery = (projectId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["logic-flows", projectId];

  const queryResult = useQuery({
    queryKey: queryKey,
    queryFn: () => listLogicFlows(projectId),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
