import { useEditorStore } from "@/stores/editor";
import { useCallback, useEffect } from "react";
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

        // Hide the original element
        el.style.display = "none";

        // Create a temporary invisible element
        const tempEl = el;
        tempEl.style.display = "block";
        w.document.body.appendChild(tempEl);

        // Set the drag image to the temporary invisible element
        event.dataTransfer.setDragImage(tempEl, left, top);
        event.dataTransfer.effectAllowed = "copyMove";

        // Clean up the temporary element after a short delay
        setTimeout(() => {
          w.document.body.removeChild(tempEl);
        }, 0);
      }

      onDragStart(id);
    },
    [id, onDragStart, currentWindow, isResizing, ghostImagePosition],
  );

  function highlightEdgeIfClose(
    edge: number,
    mouse: number,
    rect: any,
    position: string,
    element: any,
    id: string,
  ) {
    // const updateTreeComponentAttrs =
    //   useEditorTreeStore.getState().updateTreeComponentAttrs;
    const threshold = 20;
    const distance = Math.abs(edge - mouse);
    if (distance <= threshold) {
      const highlight = currentWindow?.document.createElement("div")!;
      highlight.className = "highlight";
      highlight.style.position = `absolute`;
      highlight.style.backgroundColor = `rgba(255, 0, 0, 0.5)`;

      function roundToNearestMultipleOf2(number: number) {
        return Math.round(number / 2) * 2;
      }

      const size = roundToNearestMultipleOf2(threshold - distance);
      if (position === "left" || position === "right") {
        highlight.style.width = `${size}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.top = `${rect.top}px`;
        highlight.style.left =
          position === "left" ? `${rect.left - size}px` : `${rect.right}px`;
        element.style.marginLeft = position === "left" ? `${size}px` : null;
        element.style.marginRight = position === "right" ? `${size}px` : null;
      } else {
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${size}px`;
        highlight.style.left = `${rect.left}px`;
        highlight.style.top =
          position === "top" ? `${rect.top - size}px` : `${rect.bottom}px`;
        element.style.marginTop = position === "top" ? `${size}px` : null;
        element.style.marginBottom = position === "bottom" ? `${size}px` : null;
      }
      currentWindow?.document.body.appendChild(highlight);
    }
  }

  function clearHighlights() {
    currentWindow?.document
      .querySelectorAll(".highlight")
      .forEach((el) => el.remove());
  }

  return {
    draggable: true,
    onDragStart: handleDragStart,

    onDrag: (e: any) => {
      console.log("draggable->", { x: e.clientX, y: e.clientY });

      clearHighlights();
      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;
      const debouncedPosition = { x: e.clientX, y: e.clientY };

      const elements = currentWindow?.document.elementsFromPoint(
        debouncedPosition.x,
        debouncedPosition.y,
      );

      let closestEdge: any = null;
      let minDistance = Infinity;

      // console.log(elements);
      elements?.forEach((el) => {
        if (el !== currentWindow?.document.body) {
          const rect = el.getBoundingClientRect();
          const newId = el?.getAttribute("data-id") ?? el?.getAttribute("id")!;
          if (
            !componentMutableAttrs[newId] ||
            newId === "root" ||
            newId === "main-content"
          ) {
            return;
          }
          // console.log(el, rect);
          // highlightEdgeIfClose(
          //   rect.left,
          //   debouncedPosition.x,
          //   rect,
          //   "left",
          //   el,
          //   newId,
          // );
          // highlightEdgeIfClose(
          //   rect.right,
          //   debouncedPosition.x,
          //   rect,
          //   "right",
          //   el,
          //   newId,
          // );
          // highlightEdgeIfClose(
          //   rect.top,
          //   debouncedPosition.y,
          //   rect,
          //   "top",
          //   el,
          //   newId,
          // );
          // highlightEdgeIfClose(
          //   rect.bottom,
          //   debouncedPosition.y,
          //   rect,
          //   "bottom",
          //   el,
          //   newId,
          // );

          const edges = [
            {
              position: "left",
              distance: Math.abs(rect.left - debouncedPosition.x),
            },
            {
              position: "right",
              distance: Math.abs(rect.right - debouncedPosition.x),
            },
            {
              position: "top",
              distance: Math.abs(rect.top - debouncedPosition.y),
            },
            {
              position: "bottom",
              distance: Math.abs(rect.bottom - debouncedPosition.y),
            },
          ];

          edges.forEach((edge) => {
            if (edge.distance < minDistance) {
              minDistance = edge.distance;
              closestEdge = { ...edge, rect, el, newId };
            }
          });
        }
      });

      if (closestEdge && minDistance <= 20) {
        highlightEdgeIfClose(
          closestEdge.rect[closestEdge.position],
          debouncedPosition[
            closestEdge.position === "left" || closestEdge.position === "right"
              ? "x"
              : "y"
          ],
          closestEdge.rect,
          closestEdge.position,
          closestEdge.el,
          closestEdge.newId,
        );
      }
    },
  };
};
