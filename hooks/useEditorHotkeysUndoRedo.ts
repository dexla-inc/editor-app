import { useAppMode } from "@/hooks/useAppMode";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useHotkeys } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import { decodeSchema } from "@/utils/compression";
import { getPageState } from "@/requests/pages/queries-noauth";

export const useEditorHotkeysUndoRedo = () => {
  const { isPreviewMode } = useAppMode();

  const setEditorTree = useEditorTreeStore((state) => state.setTree);

  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;

  const pageId = useEditorTreeStore((state) => state.currentPageId) as string;

  const pageLoadTimestamp = useEditorTreeStore(
    (state) => state.pageLoadTimestamp,
  ) as number;
  const historyCount = useEditorTreeStore((state) => state.historyCount);
  const setHistoryCount = useEditorTreeStore((state) => state.setHistoryCount);

  const undo = useCallback(() => {
    setHistoryCount((historyCount ?? 0) + 1);
  }, [setHistoryCount, historyCount]);

  const redo = useCallback(() => {
    if (historyCount) setHistoryCount(Math.max(0, historyCount - 1));
  }, [setHistoryCount, historyCount]);

  useEffect(() => {
    const handlePageState = async () => {
      const pageState = await getPageState(
        projectId,
        pageId,
        pageLoadTimestamp,
        historyCount,
      );
      const decodedSchema = decodeSchema(pageState?.state);
      setEditorTree(JSON.parse(decodedSchema), {
        action: "Undo/Redo",
        skipSave: true,
      });
    };

    if (historyCount !== null) {
      handlePageState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyCount]);

  // Add this page to fix undo for delete component
  // useEffect(() => {
  //   console.log("pastStates", pastStates);
  // }, [pastStates]);

  const handlePageStateChange = (
    operation: (steps?: number | undefined) => void,
  ) => {
    operation();
  };

  useHotkeys([
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) {
          //if (pastStates.length <= 1) return; // to avoid rendering a blank page
          handlePageStateChange(undo);
        }
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
  ]);

  useHotkeysOnIframe([
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) {
          //if (pastStates.length <= 1) return; // to avoid rendering a blank page
          handlePageStateChange(undo);
        }
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) {
          handlePageStateChange(redo);
        }
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) {
          handlePageStateChange(redo);
        }
      },
    ],
  ]);
};

export default useEditorHotkeysUndoRedo;
