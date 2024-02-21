import { getPageState } from "@/requests/pages/queries-noauth";
import { useAppStore } from "@/stores/app";
import { emptyEditorTree, useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { decodeSchema } from "@/utils/compression";
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
  const { startLoading, stopLoading, setIsLoading } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
    setIsLoading: state.setIsLoading,
  }));

  const setEditorTree = useEditorStore((state) => state.setTree);

  const { pageCancelled, setPageCancelled } = useUserConfigStore((state) => ({
    pageCancelled: state.pageCancelled,
    setPageCancelled: state.setPageCancelled,
  }));

  const getPageData = async ({ signal }: getPageDataParams) => {
    const page = await getPageState(projectId, pageId, { signal });

    setIsLoading(true);

    if (pageCancelled) {
      setEditorTree(defaultPageState, {
        onLoad: false,
        action: "Initial State",
      });
      setPageCancelled(false);
      setIsLoading(false);
      stopLoading({
        id: "go-to-editor",
        title: "Page Loaded",
        message: "Your page has successfully loaded",
      });
    } else if (page.state) {
      const decodedSchema = decodeSchema(page.state);
      setEditorTree(JSON.parse(decodedSchema), {
        onLoad: true,
        action: "Initial State",
      });

      setIsLoading(false);
      stopLoading({
        id: "go-to-editor",
        title: "Page Loaded",
        message: "Your page has successfully loaded",
      });
    } else {
      setIsLoading(false);
      // Commenting out AI page generation for now
      // setIsLoading(true);
      // startLoading({
      //   id: "page-generation",
      //   title: "Generating Page",
      //   message: "AI is generating your page",
      // });
      // const templateToUse = await analyseTemplateToUse(
      //   page.name,
      //   page.description ?? "",
      //   undefined,
      //   undefined,
      //   { signal },
      // );
      // const template = await getTemplate(templateToUse.name, true);
      // // TODO: Replace tiles from template state with tiles from aiPageTemplate
      // const templateTreeState = JSON.parse(decodeSchema(template.state));
      // // const _project = await fetch(`/api/project/${projectId}`, {
      // //   method: "GET",
      // //   headers: {
      // //     "Content-Type": "application/json",
      // //   },
      // //   signal,
      // // }).then((projectResponse) => projectResponse.json());
      // // TODO: Add tiles into AI response /api/ai/page
      // // const treeState = replaceTilesData(
      // //   templateTreeState,
      // //   template.tiles ?? [],
      // //   _project?.data,
      // // );
      // setEditorTree(templateTreeState);
      // stopLoading({
      //   id: "page-generation",
      //   title: "Page Generated",
      //   message: "Here's your page. We hope you like it",
      // });
    }
  };

  useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: async ({ signal }) => await getPageData({ signal }),
    enabled: !!projectId && !!pageId,
  });
};
