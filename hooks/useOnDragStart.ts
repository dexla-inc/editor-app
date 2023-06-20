import { useEditorStore } from "@/stores/editor";
import { useCallback } from "react";

export const useOnDragStart = () => {
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );

  const onDragStart = useCallback(
    (activeId: string) => {
      setSelectedComponentId(activeId);
    },
    [setSelectedComponentId]
  );

  return onDragStart;
};
