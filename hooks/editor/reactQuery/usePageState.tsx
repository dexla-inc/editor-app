import { getPageState } from "@/requests/pages/mutations";
import { PageStateResponse } from "@/requests/pages/types";
import { useQuery } from "@tanstack/react-query";

const cacheTime = 5 * 1000; // 5 seconds

export const usePageState = (
  projectId: string,
  pageId: string,
  pageLoadTimestamp: number,
  history: number | null,
) => {
  const queryResult = useQuery<PageStateResponse, Error>({
    queryKey: ["page-state", projectId, pageId, pageLoadTimestamp, history],
    queryFn: () =>
      getPageState(projectId, pageId, pageLoadTimestamp, history, {}),
    staleTime: cacheTime,
    enabled: !!projectId && !!pageId && !!pageLoadTimestamp,
  });

  return { ...queryResult };
};
