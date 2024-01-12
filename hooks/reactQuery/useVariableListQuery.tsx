import { PagingResponse } from "@/requests/types";
import { listVariables } from "@/requests/variables/queries-noauth";
import { VariableResponse } from "@/requests/variables/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useVariableListQuery = (projectId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["variables", projectId];

  const queryResult = useQuery<PagingResponse<VariableResponse>, Error>({
    queryKey: queryKey,
    queryFn: () => listVariables(projectId),
    staleTime: cacheTime,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
