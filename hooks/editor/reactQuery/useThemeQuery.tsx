import { getTheme } from "@/requests/themes/queries";
import { ThemeResponse } from "@/requests/themes/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useGetThemeQuery = (projectId: string) => {
  const queryKey = ["theme", projectId];

  const queryResult = useQuery<ThemeResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getTheme(projectId),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
