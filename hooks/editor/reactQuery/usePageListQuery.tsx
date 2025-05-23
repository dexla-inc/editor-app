import { getPageList } from "@/requests/pages/mutations";
import { PageListResponse } from "@/requests/pages/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const usePageListQuery = (
  projectId: string,
  search?: string | null,
  isEnabled = true,
) => {
  const queryKey = ["pages", projectId, search];

  const queryResult = useQuery<PageListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getPageList(projectId, { search: search ?? "" }),
    staleTime: cacheTime,
    enabled: !!projectId && isEnabled,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
