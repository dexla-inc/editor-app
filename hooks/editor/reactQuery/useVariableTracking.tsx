import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const getVariableTracking = (
  projectId: string,
  pageId: string,
  variableId: string,
  accessToken: string,
) =>
  fetch(
    `/api/project/${projectId}/track?variableId=${variableId}&pageId=${pageId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    },
  ).then((res) => res.json());

export const useVariableTracking = (
  projectId: string,
  pageId: string,
  variableId: string,
  accessToken: string,
) => {
  const queryKey = [
    "variableTracking",
    projectId,
    pageId,
    variableId,
    accessToken,
  ];

  const queryResult = useQuery<any, Error>({
    queryKey: queryKey,
    queryFn: () =>
      getVariableTracking(projectId, pageId, variableId, accessToken),
    staleTime: 0,
    enabled: !!projectId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { ...queryResult, invalidate };
};
