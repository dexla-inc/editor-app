import { useEditorStore } from "@/stores/editor";
import { useCallback } from "react";

export const useOnDragStart = () => {
  const setSelectedComponentIds = useEditorStore(
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
