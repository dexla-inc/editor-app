import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useFlowsQuery = (projectId?: string) => {
  const queryKey = ["logic-flows", projectId];

  const queryResult = useQuery({
    queryKey: queryKey,
    queryFn: () => listLogicFlows(projectId as string),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
