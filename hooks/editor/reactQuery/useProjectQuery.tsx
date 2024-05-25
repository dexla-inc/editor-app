import { getProject } from "@/requests/projects/queries-noauth";
import { ProjectResponse } from "@/requests/projects/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useProjectQuery = (projectId: string | undefined) => {
  const queryKey = ["project", projectId];

  const queryResult = useQuery<ProjectResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getProject(projectId ?? "", true),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const refetch = () => {
    queryClient.refetchQueries({ queryKey });
  };

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, refetch, invalidate };
};
