import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
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
      // console.log("not resizing");
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

      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;
      const setElementRects = useEditorStore.getState().setElementRects;

      // getting all element rects so we can draw the block state
      const targets = Object.entries(componentMutableAttrs).reduce(
        (acc, [key, attrs]) => {
          if (
            attrs.blockDroppingChildrenInside &&
            !["root", "content-wrapper", "main-content", id].includes(key)
          ) {
            const element =
              w?.document?.querySelector(`[data-id^="${key}"]`) ??
              w?.document?.querySelector(`[id^="${key}"]`);
            if (element) {
              const targetRect = element.getBoundingClientRect();
              acc[key] = targetRect;
            }
          }
          return acc;
        },
        {} as Record<string, DOMRect>,
      );

      setElementRects(targets);

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
    draggable: id !== "main-content" ? true : false,
    onDragStart: handleDragStart,
  };
};
