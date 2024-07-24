import { useEditorTreeStore } from "@/stores/editorTree";
import { useCallback, useState } from "react";

export const useUndoRedo = () => {
  const historyCount = useEditorTreeStore((state) => state.historyCount);
  const setHistoryCount = useEditorTreeStore((state) => state.setHistoryCount);
  const [canRedo, setCanRedo] = useState(false);

  const undo = useCallback(() => {
    setHistoryCount((historyCount ?? 0) + 1);
  }, [setHistoryCount, historyCount]);

  const redo = useCallback(() => {
    if (historyCount) setHistoryCount(Math.max(0, historyCount - 1));
  }, [setHistoryCount, historyCount]);

  return { undo, redo, canRedo, setCanRedo, historyCount };
};
