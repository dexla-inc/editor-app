import { getMostRecentDeployment } from "@/requests/deployments/queries-noauth";
import { DeploymentResponse } from "@/requests/deployments/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useDeploymentsRecentQuery = (projectId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["deployments", projectId];

  const queryResult = useQuery<DeploymentResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getMostRecentDeployment(projectId),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
