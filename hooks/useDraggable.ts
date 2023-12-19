import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { NAVBAR_WIDTH } from "@/utils/config";
import { useCallback } from "react";

export const useDraggable = ({
  id,
  onDragStart,
  currentWindow,
}: {
  id: string;
  onDragStart: (id: string) => void;
  currentWindow?: Window;
}) => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (isResizing) return;

      const w = currentWindow ?? window;
      const el = w.document.getElementById(id)!;
      const rect = el?.getBoundingClientRect()!;

      if (rect) {
        let left = event.pageX - rect.left - w.scrollX;
        const top = event.pageY - rect.top - w.scrollY;

        if (isTabPinned) left = left - NAVBAR_WIDTH;

        event.dataTransfer.setDragImage(el, left, top);
        event.dataTransfer.effectAllowed = "copyMove";
      }

      onDragStart(id);
    },
    [id, onDragStart, currentWindow, isResizing, isTabPinned],
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};
