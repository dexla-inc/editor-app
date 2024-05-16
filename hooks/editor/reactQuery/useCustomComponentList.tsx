import { getComponentList } from "@/requests/components/queries-noauth";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";

const cacheTime = 30 * 60 * 1000; // 60 minutes

export const useCustomComponentList = (
  projectId: string,
  companyId: string,
  componentTypeToShow: string,
) => {
  const queryKey = ["components", projectId, companyId];

  const queryResult = useQuery({
    queryKey: queryKey,
    queryFn: () => getComponentList(projectId, companyId),
    enabled: !!projectId && componentTypeToShow === "custom",
    staleTime: cacheTime,
    networkMode: "offlineFirst",
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
