import { getPage, getPageTemplate } from "@/requests/pages/queries";
import { decodeSchema } from "@/utils/compression";
import { replaceTilesData } from "@/utils/editor";
import { useAppStore } from "@/stores/app";
import { emptyEditorTree, useEditorStore } from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";

type getPageDataParams = {
  signal: AbortSignal | undefined;
};

export const defaultPageState = {
  name: "Initial State",
  timestamp: Date.now(),
  root: emptyEditorTree.root,
};

export const useGetPageData = ({
  projectId,
  pageId,
}: {
  projectId: string;
  pageId: string;
}) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const getPageData = async ({ signal }: getPageDataParams) => {
    setIsLoading(true);
    const page = await getPage(projectId, pageId, {}, { signal });
    if (page.pageState) {
      const decodedSchema = decodeSchema(page.pageState);
      setEditorTree(JSON.parse(decodedSchema), {
        onLoad: true,
        action: "Initial State",
      });

      setIsLoading(false);
    } else {
      startLoading({
        id: "page-generation",
        title: "Generating Page",
        message: "AI is generating your page",
      });

      const aiPageTemplate = await getPageTemplate(projectId, pageId, {
        signal,
      });
      const template = await fetch(
        `/api/templates/${aiPageTemplate.template.name.replace(
          "Template",
          "",
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        },
      ).then((templateResponse) => templateResponse.json());

      const project = await fetch(`/api/project/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      }).then((projectResponse) => projectResponse.json());

      // TODO: Replace tiles from template state with tiles from aiPageTemplate
      const aiTiles = aiPageTemplate.template.tiles;
      const treeState = replaceTilesData(
        template.state,
        aiTiles,
        project?.data,
      );

      setEditorTree(treeState);
      stopLoading({
        id: "page-generation",
        title: "Page Generated",
        message: "Here's your page. We hope you like it",
      });
    }
  };

  useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: async ({ signal }) => await getPageData({ signal }),
    enabled: !!projectId && !!pageId,
  });
};
