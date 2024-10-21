import { getPageState } from "@/requests/pages/mutations";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import {
  cloneObject,
  emptyCssGridTree,
  emptyEditorTree,
  safeJsonParse,
} from "@/utils/common";
import { decodeSchema } from "@/utils/compression";
import { useQuery } from "@tanstack/react-query";

type getPageDataParams = {
  signal: AbortSignal | undefined;
};

export const defaultPageState = {
  name: "Initial State 2",
  timestamp: Date.now(),
  root: emptyCssGridTree.root,
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
  const setPageLoadTree = useEditorTreeStore((state) => state.setPageLoadTree);

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
        setEditorTree(defaultPageState, {
          onLoad: false,
          action: "Initial State",
        });
        setPageCancelled(false);
        setIsLoading(false);

        return defaultPageState;
      } else if (page.state) {
        const decodedSchema = decodeSchema(page.state);
        const parsedTree = safeJsonParse(decodedSchema);

        const filteredTree = filterNestedPropsAndTheme(parsedTree);

        setEditorTree(filteredTree, {
          onLoad: true,
          action: "Initial State",
        });
        const initialTree = cloneObject(parsedTree);

        setPageLoadTree(initialTree);
        setIsLoading(false);
        return safeJsonParse(decodedSchema);
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
    queryKey: ["page-state", projectId, pageId, history.state.as],
    queryFn: async ({ signal }) => await getPageData({ signal }),
    ...{ enabled: !!projectId && !!pageId },
  });
};

const filterNestedPropsAndTheme = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(filterNestedPropsAndTheme);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      if (
        key === "props" &&
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        acc[key] = Object.keys(obj[key]).reduce((innerAcc, innerKey) => {
          if (innerKey !== "pages" && innerKey !== "theme") {
            innerAcc[innerKey] = filterNestedPropsAndTheme(obj[key][innerKey]);
          }
          return innerAcc;
        }, {} as any);
      } else {
        acc[key] = filterNestedPropsAndTheme(obj[key]);
      }
      return acc;
    }, {} as any);
  }
  return obj;
};
