import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useFlowsQuery = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;
  const queryClient = useQueryClient();

  const queryKey = ["logic-flows", projectId, pageId];

  const queryResult = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await listLogicFlows(projectId, { pageId });
      return response.results ?? [];
    },
    initialData: [],
    enabled: !!projectId && !!pageId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return { ...queryResult, invalidate };
};
