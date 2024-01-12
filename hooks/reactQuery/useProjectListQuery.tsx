import { getProjects } from "@/requests/projects/queries";
import { ProjectListResponse } from "@/requests/projects/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 60 * 60 * 1000; // 30 minutes

export const useProjectListQuery = (orgId: string, search: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["projects", orgId, search];

  const queryResult = useQuery<ProjectListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getProjects(orgId, search),
    enabled: !!orgId,
    staleTime: cacheTime,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
