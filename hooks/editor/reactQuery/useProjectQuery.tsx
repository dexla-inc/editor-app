import { getProject } from "@/requests/projects/mutations";
import { ProjectResponse } from "@/requests/projects/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

//const cacheTime = 5 * 1000; // 5 seconds

export const useProjectQuery = (
  projectId: string | undefined,
  enabled?: boolean,
) => {
  const queryKey = ["project", projectId];

  const queryResult = useQuery<ProjectResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getProject(projectId ?? "", true),
    //staleTime: cacheTime,
    enabled: !!projectId && enabled !== false,
  });

  const refetch = () => {
    queryClient.refetchQueries({ queryKey });
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, refetch, invalidate };
};

export const invalidateQueries = (queryKey: (string | undefined)[]) => {
  queryClient.invalidateQueries({ queryKey });
};
