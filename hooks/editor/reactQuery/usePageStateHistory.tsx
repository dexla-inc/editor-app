import { getPageStateHistory } from "@/requests/pages/mutations";
import { PageStateHistoryResponse } from "@/requests/pages/types";
import { PagingResponse } from "@/requests/types";
import { queryClient } from "@/utils/reactQuery";
import { useQuery } from "@tanstack/react-query";

const cacheTime = 5 * 1000; // 5 seconds

export const usePageStateHistory = (
  projectId: string,
  pageId: string,
  timestamp: number,
) => {
  const queryKey = ["page-state-history", projectId, pageId, timestamp];

  const queryResult = useQuery<PagingResponse<PageStateHistoryResponse>, Error>(
    {
      queryKey: queryKey,
      queryFn: () => getPageStateHistory(projectId, pageId, timestamp),
      staleTime: cacheTime,
      enabled: !!projectId && !!pageId && !!timestamp,
    },
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
