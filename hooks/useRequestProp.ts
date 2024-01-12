import { getDataSources } from "@/requests/datasources/queries-noauth";
import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { getPage } from "@/requests/pages/queries-noauth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useRequestProp = (val?: string) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: page } = useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: () => getPage(projectId, pageId),
    enabled: !!projectId && !!pageId,
  });

  const dataSources = useQuery({
    queryKey: ["datasources"],
    queryFn: () => getDataSources(projectId, {}),
    enabled: !!projectId,
  });

  const { data: flows } = useQuery({
    queryKey: ["logic-flows", projectId, pageId],
    queryFn: async () => {
      const response = await listLogicFlows(projectId, { pageId });
      return response.results ?? [];
    },
    enabled: !!projectId && !!pageId,
  });

  return { page, dataSources, flows };
};
