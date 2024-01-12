import { getProject } from "@/requests/projects/queries-noauth";
import { ProjectResponse } from "@/requests/projects/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useProjectQuery = (projectId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["project", projectId];

  const queryResult = useQuery<ProjectResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getProject(projectId),
    staleTime: cacheTime,
  });

  const refetch = () => {
    queryClient.refetchQueries(queryKey);
  };

  return { ...queryResult, refetch };
};
