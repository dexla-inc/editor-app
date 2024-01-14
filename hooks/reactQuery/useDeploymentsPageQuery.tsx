import { getMostRecentDeploymentByPage } from "@/requests/deployments/queries-noauth";
import { DeploymentPage } from "@/requests/deployments/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 24 * 60 * 60 * 1000; // 1 day

export const useDeploymentsPageQuery = (projectId: string, pageId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["deployments-page", projectId, pageId];

  const queryResult = useQuery<DeploymentPage, Error>({
    queryKey: queryKey,
    queryFn: () => getMostRecentDeploymentByPage(projectId, { page: pageId }),
    staleTime: cacheTime,
    enabled: !!projectId && !!pageId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(["deployments-page"]);
  };

  return { ...queryResult, invalidate };
};
