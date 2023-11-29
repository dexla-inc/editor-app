import { useEditorStore } from "@/stores/editor";
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

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (isResizing) return;

      const w = currentWindow ?? window;
      const el = w.document.getElementById(id)!;
      const rect = el?.getBoundingClientRect()!;

      if (rect) {
        const left = event.pageX - rect.left - w.scrollX;
        const top = event.pageY - rect.top - w.scrollY;

        event.dataTransfer.setDragImage(el, left, top);
        event.dataTransfer.effectAllowed = "copyMove";
      }

      onDragStart(id);
    },
    [id, onDragStart, currentWindow, isResizing],
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};
