import { getPageStateHistory } from "@/requests/pages/mutations";
import { PageStateHistoryResponse } from "@/requests/pages/types";
import { PagingResponse } from "@/requests/types";
import { queryClient } from "@/utils/reactQuery";
import { useQuery } from "@tanstack/react-query";

const cacheTime = 5 * 1000; // 5 seconds

export const usePageStateHistory = (
  projectId: string,
  pageId: string,
  offset: number,
  limit: number,
) => {
  const queryKey = ["page-state-history", projectId, pageId, offset, limit];

  const queryResult = useQuery<PagingResponse<PageStateHistoryResponse>, Error>(
    {
      queryKey: queryKey,
      queryFn: () => getPageStateHistory(projectId, pageId, offset, limit),
      staleTime: cacheTime,
      enabled: !!projectId && !!pageId,
    },
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
