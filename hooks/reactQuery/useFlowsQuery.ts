import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFlowsQuery = (projectId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["logic-flows", projectId];

  const queryResult = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await listLogicFlows(projectId);
      return response.results ?? [];
    },
    initialData: [],
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
