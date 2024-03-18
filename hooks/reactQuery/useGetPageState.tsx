import { getPageState } from "@/requests/pages/queries-noauth";
import { PageStateResponse } from "@/requests/pages/types";
import { useQuery } from "@tanstack/react-query";

const cacheTime = 5 * 1000; // 5 seconds

export const useGetPageState = (
  projectId: string,
  pageId: string,
  pageLoadTimestamp: number,
  history: number | null,
) => {
  const queryKey = [
    "page-state",
    projectId,
    pageId,
    pageLoadTimestamp,
    history,
  ];

  const queryResult = useQuery<PageStateResponse, Error>({
    queryKey: queryKey,
    queryFn: () =>
      getPageState(projectId, pageId, pageLoadTimestamp, history, {}),
    staleTime: cacheTime,
    enabled: !!projectId && !!pageId,
  });

  return { ...queryResult };
};
