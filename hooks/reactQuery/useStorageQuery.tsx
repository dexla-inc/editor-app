import { getAllFiles } from "@/requests/storage/queries-noauth";
import { UploadMultipleResponse } from "@/requests/storage/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useStorageQuery = (projectId: string) => {
  const queryKey = ["storage", projectId];

  const queryResult = useQuery<UploadMultipleResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getAllFiles(projectId),
    staleTime: cacheTime,
    enabled: !!projectId,
  });

  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
