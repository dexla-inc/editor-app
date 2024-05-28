import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";
import { getDeploymentPageHistory } from "@/requests/deployments/mutations";
import { PagingResponse } from "@/requests/types";
import { DeploymentPageHistory } from "@/requests/deployments/types";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useDeploymentPageHistory = (
  projectId: string,
  pageId: string,
  offset: number,
  limit: number,
) => {
  const queryKey = ["deployment-pages", projectId, pageId, offset, limit];

  const queryResult = useQuery<PagingResponse<DeploymentPageHistory>, Error>({
    queryKey: queryKey,
    queryFn: () => getDeploymentPageHistory(projectId, pageId, offset, limit),
    staleTime: cacheTime,
    enabled: !!projectId && !!pageId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
