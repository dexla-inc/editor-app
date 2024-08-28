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

      // Remove the preview element if it exists
      const previewElement =
        currentWindow?.document.getElementById("preview-element");
      if (previewElement) {
        previewElement.remove();
      }

      const setIsDragging = useEditorStore.getState().setIsDragging;

      const w = currentWindow ?? window;
      const el = w.document.getElementById(id)!;
      const rect = el?.getBoundingClientRect()!;

      if (rect) {
        const left = rect.width;
        const top = rect.height;

        event.dataTransfer.setDragImage(el, left, top);
        event.dataTransfer.effectAllowed = "copyMove";
      }

      onDragStart(id);
      setIsDragging(true);
      const rootElement = w.document.getElementById("root");
      if (rootElement) {
        rootElement.style.opacity = "0.7";
      }
    },
    [id, onDragStart, currentWindow, isResizing],
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};
