import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { emptyEditorTree } from "@/utils/common";
import { decodeSchema } from "@/utils/compression";
import { usePageState } from "@/hooks/reactQuery/usePageState";

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
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const pageLoadTimestamp = useEditorTreeStore(
    (state) => state.pageLoadTimestamp,
  );

  const { data: page } = usePageState(
    projectId,
    pageId,
    pageLoadTimestamp ?? 0,
    null,
  );

  // if (!isFetched) {
  //   return;
  // }

  if (page?.state) {
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
    return JSON.parse(decodedSchema);
  } else if (page) {
    setIsLoading(false);
    setEditorTree(defaultPageState, {
      onLoad: true,
      action: "Initial State",
    });
    return defaultPageState;
  }
};
