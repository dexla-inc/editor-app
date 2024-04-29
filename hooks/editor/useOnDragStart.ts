import { useEditorTreeStore } from "@/stores/editorTree";
import { useCallback } from "react";

export const useOnDragStart = () => {
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );

  const onDragStart = useCallback(
    (activeId: string) => {
      setSelectedComponentIds(() => [activeId]);
    },
    [setSelectedComponentIds],
  );

  return onDragStart;
};
