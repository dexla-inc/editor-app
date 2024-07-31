import { useEditorStore } from "@/stores/editor";
import { useCallback } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";

export const useDraggable = ({
  id,
  onDragStart,
  currentWindow,
  ghostImagePosition,
}: {
  id: string;
  onDragStart: (id: string) => void;
  currentWindow?: Window;
  ghostImagePosition?: number;
}) => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const setIsDragging = useEditorTreeStore((state) => state.setIsDragging);

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (isResizing) return;

      setIsDragging(true);

      const w = currentWindow ?? window;
      const el = w.document.getElementById(id)!;
      const rect = el?.getBoundingClientRect()!;

      if (rect) {
        let left = event.pageX - rect.left - w.scrollX;
        const top = event.pageY - rect.top - w.scrollY;

        if (ghostImagePosition) left = left - ghostImagePosition;

        event.dataTransfer.setDragImage(el, left, top);
        event.dataTransfer.effectAllowed = "copyMove";
      }

      onDragStart(id);
    },
    [id, onDragStart, currentWindow, isResizing, ghostImagePosition],
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};
