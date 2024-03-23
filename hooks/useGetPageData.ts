import { getPageState } from "@/requests/pages/queries-noauth";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { emptyEditorTree } from "@/utils/common";
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

type Props = {
  projectId: string;
  pageId: string;
};

export const useGetPageData = ({ projectId, pageId }: Props) => {
  const { startLoading, stopLoading, setIsLoading } = useAppStore((state) => ({
    startLoading: state.startLoading,
    stopLoading: state.stopLoading,
    setIsLoading: state.setIsLoading,
  }));

  const setEditorTree = useEditorTreeStore((state) => state.setTree);

  const { pageCancelled, setPageCancelled } = useUserConfigStore((state) => ({
    pageCancelled: state.pageCancelled,
    setPageCancelled: state.setPageCancelled,
  }));

  const pageLoadTimestamp = useEditorTreeStore(
    (state) => state.pageLoadTimestamp,
  );

  const getPageData = async ({ signal }: getPageDataParams) => {
    startLoading({
      id: "go-to-editor",
      title: "Loading Page",
      message: "Wait while we load your page",
    });

    try {
      const page = await getPageState(
        projectId,
        pageId,
        pageLoadTimestamp,
        null,
        { signal },
      );

      setIsLoading(true);

      if (pageCancelled) {
        //TODO: get this back - we might not need this
        setEditorTree(defaultPageState, {
          onLoad: false,
          action: "Initial State",
        });
        setPageCancelled(false);
        setIsLoading(false);

        return defaultPageState;
      } else if (page.state) {
        const decodedSchema = decodeSchema(page.state);
        setEditorTree(JSON.parse(decodedSchema), {
          onLoad: true,
          action: "Initial State",
        });

        setIsLoading(false);
        return JSON.parse(decodedSchema);
      } else {
        setIsLoading(false);
        return defaultPageState;
      }
    } catch (error: any) {
      stopLoading({
        id: "go-to-editor",
        title: "Page Failed",
        message: error,
        isError: true,
      });
    } finally {
      stopLoading({
        id: "go-to-editor",
        title: "Page Loaded",
        message: "Your page has successfully loaded",
      });
    }
  };

  useQuery({
    queryKey: ["page-state", projectId, pageId, history],
    queryFn: async ({ signal }) => await getPageData({ signal }),
    enabled: !!projectId && !!pageId,
  });
};
