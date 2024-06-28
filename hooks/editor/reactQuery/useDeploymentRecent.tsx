import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";
import { getRecentDeployment } from "@/requests/deployments/mutations";
import { PagingResponse } from "@/requests/types";
import { DeploymentResponse } from "@/requests/deployments/types";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useDeploymentRecent = (projectId: string) => {
  const queryKey = ["deployment-recent", projectId];

  const queryResult = useQuery<PagingResponse<DeploymentResponse>, Error>({
    queryKey: queryKey,
    queryFn: () => getRecentDeployment(projectId),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
