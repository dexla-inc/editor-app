import { getDataSources } from "@/requests/datasources/queries-noauth";
import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { getPage } from "@/requests/pages/queries-noauth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { decodeSchema } from "@/utils/compression";
import { useEditorStore } from "@/stores/editor";

export const useRequestProp = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;
  const setTree = useEditorStore((state) => state.setTree);

  const usePageQuery = () => {
    return useQuery({
      queryKey: ["page", projectId, pageId],
      queryFn: async () => {
        const page = await getPage(projectId, pageId);
        if (page?.pageState) {
          setTree(JSON.parse(decodeSchema(page.pageState)));
        }

        return page;
      },
      enabled: !!projectId && !!pageId,
    });
  };

  const useDataSourcesQuery = () => {
    return useQuery({
      queryKey: ["datasources", projectId],
      queryFn: () => getDataSources(projectId, {}),
      enabled: !!projectId,
    });
  };

  const useFlowsQuery = () => {
    return useQuery({
      queryKey: ["logic-flows", projectId, pageId],
      queryFn: async () => {
        const response = await listLogicFlows(projectId, { pageId });
        return response.results ?? [];
      },
      initialData: [],
      enabled: !!projectId && !!pageId,
    });
  };

  return { usePageQuery, useDataSourcesQuery, useFlowsQuery };
};
