import { getPage } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const usePageQuery = (
  projectId: string,
  pageId: string,
  isEnabled = true,
) => {
  const queryKey = ["page", projectId, pageId];

  const queryResult = useQuery<PageResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getPage(projectId, pageId),
    staleTime: cacheTime,
    enabled: !!projectId && isEnabled,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const refetch = () => {
    queryClient.refetchQueries({ queryKey });
  };

  return { ...queryResult, invalidate, refetch };
};
