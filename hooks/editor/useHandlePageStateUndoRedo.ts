import { useEffect, useCallback } from "react";
import { useUndoRedo } from "./useUndoRedo";
import { useEditorTreeStore } from "@/stores/editorTree";
import { decodeSchema } from "@/utils/compression";
import { getPageState } from "@/requests/pages/mutations";
import { useOldRouter } from "@/hooks/data/useOldRouter";

export const useHandlePageStateUndoRedo = () => {
  const { historyCount, setCanRedo } = useUndoRedo();
  const router = useOldRouter();
  const { id: projectId, page: pageId } = router.query as {
    id: string;
    page: string;
  };
  const setTree = useEditorTreeStore((state) => state.setTree);
  const pageLoadTimestamp = useEditorTreeStore(
    (state) => state.pageLoadTimestamp,
  );

  const handlePageState = useCallback(async () => {
    try {
      const pageState = await getPageState(
        projectId,
        pageId,
        pageLoadTimestamp as number,
        historyCount,
      );
      const decodedSchema = decodeSchema(pageState?.state);
      setTree(JSON.parse(decodedSchema), {
        action: "Undo/Redo",
        skipSave: true,
      });
    } catch (e: any) {
      if (e === "Nothing to undo. You're all caught up!") {
        const pageLoadTree = useEditorTreeStore.getState().pageLoadTree;
        if (pageLoadTree) {
          setTree(pageLoadTree, {
            action: "Original Tree",
            skipSave: true,
          });
        }
      } else {
        console.error(e);
      }
    }
  }, [historyCount, projectId, pageId, pageLoadTimestamp, setTree]);

  useEffect(() => {
    if (historyCount !== null) {
      handlePageState();
      if (historyCount > 0) setCanRedo(true);
      else {
        setCanRedo(false);
      }
    }
  }, [historyCount, handlePageState, setCanRedo]);

  return useUndoRedo();
};
