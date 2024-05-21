import { getProjects } from "@/requests/projects/queries";
import { ProjectListResponse } from "@/requests/projects/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 60 * 60 * 1000; // 30 minutes

export const useProjectListQuery = (orgId: string, search?: string) => {
  const queryKey = ["projects", orgId, search];

  const queryResult = useQuery<ProjectListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getProjects(orgId, search),
    staleTime: cacheTime,
    enabled: !!orgId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
