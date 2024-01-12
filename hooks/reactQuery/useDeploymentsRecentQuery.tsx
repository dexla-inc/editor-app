import { getMostRecentDeployment } from "@/requests/deployments/queries-noauth";
import { DeploymentResponse } from "@/requests/deployments/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useDeploymentsRecentQuery = (projectId: string) => {
  const queryClient = useQueryClient();

  const queryKey = ["deployments", projectId];

  const queryResult = useQuery<DeploymentResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getMostRecentDeployment(projectId),
    staleTime: cacheTime,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
