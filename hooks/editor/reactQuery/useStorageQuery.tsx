import { getAllFiles } from "@/requests/storage/queries-noauth";
import {
  FileObj,
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 60 * 60 * 1000; // 60 minutes

export const useStorageQuery = (projectId: string) => {
  const queryKey = ["storage", projectId];

  const queryResult = useQuery<UploadMultipleResponse, Error, FileObj[]>({
    queryKey: queryKey,
    queryFn: () => getAllFiles(projectId),
    staleTime: cacheTime,
    enabled: !!projectId,
    select: (data) => {
      return data.files.map((file) => ({
        name: getPropFromResponse(file)?.name,
        type: getPropFromResponse(file)?.type,
        url: file.url,
      }));
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};

const getPropFromResponse = (file: UploadResponse) => {
  const underscoreIndex = file.url.indexOf("_");
  if (underscoreIndex === -1) return;

  const name = file.url.substring(underscoreIndex + 1);
  const extensionIndex = name.lastIndexOf(".");
  const type =
    extensionIndex !== -1 ? `Image.${name.substring(extensionIndex + 1)}` : "";

  return { name, type };
};
