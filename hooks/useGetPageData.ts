import { analyseTemplateToUse, getPage } from "@/requests/pages/queries";
import { getTemplate } from "@/requests/templates/queries";
import { useAppStore } from "@/stores/app";
import { emptyEditorTree, useEditorStore } from "@/stores/editor";
import { decodeSchema } from "@/utils/compression";
import { useQuery } from "@tanstack/react-query";

type getPageDataParams = {
  signal: AbortSignal | undefined;
};

export const defaultPageState = {
  name: "Initial State",
  timestamp: Date.now(),
  root: {
    ...emptyEditorTree.root,
    children: [
      {
        id: "content-wrapper",
        name: "Container",
        description: "Root Container",
        props: {
          style: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            minHeight: "50px",
          },
        },
        children: [],
      },
    ],
  },
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

      const templateToUse = await analyseTemplateToUse(
        page.name,
        page.description ?? "",
        undefined,
        undefined,
        { signal },
      );

      const template = await getTemplate(templateToUse.name, true);

      // TODO: Replace tiles from template state with tiles from aiPageTemplate
      const templateTreeState = JSON.parse(decodeSchema(template.state));
      // const _project = await fetch(`/api/project/${projectId}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   signal,
      // }).then((projectResponse) => projectResponse.json());
      // TODO: Add tiles into AI response /api/ai/page
      // const treeState = replaceTilesData(
      //   templateTreeState,
      //   template.tiles ?? [],
      //   _project?.data,
      // );

      setEditorTree(templateTreeState);
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
