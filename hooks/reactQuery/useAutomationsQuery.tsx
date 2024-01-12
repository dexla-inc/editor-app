import { getChatHistoryList } from "@/requests/ai/queries";
import { ChatHistoryMessage } from "@/requests/ai/types";
import { PagingResponse } from "@/requests/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 30 * 60 * 1000; // 30 minutes

export const useAutomationsQuery = (projectId: string, opened: boolean) => {
  const queryClient = useQueryClient();

  const queryKey = ["chatHistory", projectId];

  const queryResult = useQuery<PagingResponse<ChatHistoryMessage>, Error>({
    queryKey: queryKey,
    queryFn: () => getChatHistoryList(projectId),
    staleTime: cacheTime,
    enabled: opened,
  });

  const refetch = () => {
    queryClient.refetchQueries(queryKey);
  };

  return { ...queryResult, refetch };
};
