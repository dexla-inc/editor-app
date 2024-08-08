import { useEditorStore } from "@/stores/editor";
import { useCallback, useRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { nanoid } from "nanoid";

export const useDraggable = () => {
  const previousHighlightedElements = useRef<Set<HTMLElement>>(new Set());
  const originalPageSnapshot = useRef<HTMLElement[]>([]);
  const temporaryDiv = useRef<HTMLDivElement | null>(null);
  let closestEdge = useRef<{
    position: "top" | "left" | "right" | "bottom";
    distance: number;
    rect: DOMRect;
    el: HTMLElement;
    id: string;
  } | null>(null);

  const takeSnapshot = () => {
    const { iframeWindow: w = window } = useEditorStore.getState();
    // @ts-ignore
    originalPageSnapshot.current = Array.from(w?.document.body.children ?? []);
  };

  const resetPage = () => {
    const { iframeWindow: w = window } = useEditorStore.getState();
    w.document.body.innerHTML = "";
    originalPageSnapshot.current.forEach((el) => {
      w?.document.body.appendChild(el);
    });
  };

  const handleDragStart = useCallback((event: React.DragEvent) => {
    const { isResizing, iframeWindow: w = window } = useEditorStore.getState();
    if (isResizing) return;

    const setIsDragging = useEditorTreeStore.getState().setIsDragging;
    setIsDragging(true);

    const el = event.target as HTMLElement;
    const rect = el?.getBoundingClientRect();
    if (rect) {
      event.dataTransfer.effectAllowed = "copyMove";
    }

    takeSnapshot();
  }, []);

  function highlightEdgeIfClose(
    edge: number,
    mouse: number,
    rect: DOMRect,
    position: "top" | "left" | "right" | "bottom",
    element: HTMLElement,
  ) {
    const threshold = 20;
    const distance = Math.abs(edge - mouse);
    const { iframeWindow: w = window } = useEditorStore.getState();
    if (distance <= threshold) {
      const existingHighlight = Array.from(
        previousHighlightedElements.current,
      ).find((el) => {
        const elRect = el.getBoundingClientRect();
        return (
          Math.abs(elRect[position] - rect[position]) <= threshold &&
          el.classList.contains("highlight")
        );
      });

      if (existingHighlight) {
        function roundToNearestMultipleOf2(number: number) {
          return Math.round(number / 2) * 2;
        }

        const size = roundToNearestMultipleOf2(threshold - distance);
        if (position === "left" || position === "right") {
          existingHighlight.style.width = `${size}px`;
          existingHighlight.style.height = `${rect.height}px`;
          existingHighlight.style.top = `${rect.top}px`;
          existingHighlight.style.left =
            position === "left" ? `${rect.left - size}px` : `${rect.right}px`;
          element.style.marginLeft = position === "left" ? `${size}px` : "";
          element.style.marginRight = position === "right" ? `${size}px` : "";
        } else {
          existingHighlight.style.width = `${rect.width}px`;
          existingHighlight.style.height = `${size}px`;
          existingHighlight.style.left = `${rect.left}px`;
          existingHighlight.style.top =
            position === "top" ? `${rect.top - size}px` : `${rect.bottom}px`;
          element.style.marginTop = position === "top" ? `${size}px` : "";
          element.style.marginBottom = position === "bottom" ? `${size}px` : "";
        }
      } else {
        const highlight = w?.document.createElement("div")!;
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
          element.style.marginLeft = position === "left" ? `${size}px` : "";
          element.style.marginRight = position === "right" ? `${size}px` : "";
        } else {
          highlight.style.width = `${rect.width}px`;
          highlight.style.height = `${size}px`;
          highlight.style.left = `${rect.left}px`;
          highlight.style.top =
            position === "top" ? `${rect.top - size}px` : `${rect.bottom}px`;
          element.style.marginTop = position === "top" ? `${size}px` : "";
          element.style.marginBottom = position === "bottom" ? `${size}px` : "";
        }
        w?.document.body.appendChild(highlight);
        previousHighlightedElements.current.add(element);
      }
    }
  }

  function clearHighlights() {
    const { iframeWindow: w = window } = useEditorStore.getState();
    w?.document.querySelectorAll(".highlight").forEach((el) => el.remove());
    previousHighlightedElements.current.forEach((el) => {
      el.style.marginLeft = "";
      el.style.marginRight = "";
      el.style.marginTop = "";
      el.style.marginBottom = "";
    });
    previousHighlightedElements.current.clear();
  }

  return {
    draggable: true,
    onDragStart: handleDragStart,

    onDrag: (e: React.DragEvent) => {
      const { iframeWindow: w = window } = useEditorStore.getState();
      clearHighlights();
      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;
      const debouncedPosition = { x: e.clientX, y: e.clientY };
      const currDraggableId =
        // @ts-ignore
        e.target.getAttribute("data-id") || e.target.getAttribute("id")!;
      // console.log(currDraggableId, e.target, e.target.id);
      const elements = w?.document
        .elementsFromPoint(debouncedPosition.x, debouncedPosition.y)
        .filter((item) => {
          const currItemId = (item.getAttribute("data-id") ||
            item.getAttribute("id"))!;
          const filterIds = ["root", "main-content", currDraggableId];

          return (
            !filterIds.includes(currItemId) &&
            componentMutableAttrs[currItemId?.split("-related-").at(0)!]
          );
        });

      let localClosestEdge: {
        position: "top" | "left" | "right" | "bottom";
        distance: number;
        rect: DOMRect;
        el: HTMLElement;
        id: string;
      } | null = null;
      let minDistance = Infinity;

      elements?.forEach((el) => {
        if (el !== w?.document.body) {
          const rect = el.getBoundingClientRect();
          const itemId = el?.getAttribute("data-id") ?? el?.getAttribute("id")!;

          const edges = [
            {
              position: "left" as const,
              distance: Math.abs(rect.left - debouncedPosition.x),
            },
            {
              position: "right" as const,
              distance: Math.abs(rect.right - debouncedPosition.x),
            },
            {
              position: "top" as const,
              distance: Math.abs(rect.top - debouncedPosition.y),
            },
            {
              position: "bottom" as const,
              distance: Math.abs(rect.bottom - debouncedPosition.y),
            },
          ];

          edges.forEach((edge) => {
            if (edge.distance < minDistance) {
              minDistance = edge.distance;
              localClosestEdge = {
                ...edge,
                rect,
                el: el as HTMLElement,
                id: itemId,
              };
            }
          });
        }
      });

      if (
        (Object.keys(localClosestEdge ?? {}).length &&
          // @ts-ignore
          closestEdge.current?.id !== localClosestEdge.id) ||
        // @ts-ignore
        closestEdge.current?.position !== localClosestEdge.position
      ) {
        // @ts-ignore
        const closestParentElement = localClosestEdge?.el.parentElement;
        // if parentElement has isTemp, it means it is a temporary div
        if ("isTemp" in closestParentElement?.dataset!) {
          return;
        }

        closestEdge.current = localClosestEdge;

        const parentStyles = getComputedStyle(closestParentElement!);
        const parentFlexDirection = parentStyles.flexDirection;

        const localTemporaryDiv = w?.document.createElement("div");
        localTemporaryDiv.id = nanoid();
        localTemporaryDiv.dataset.isTemp = "true";
        localTemporaryDiv.style.height = "auto";
        localTemporaryDiv.style.width = "100%";

        if (
          parentFlexDirection === "row" &&
          // @ts-ignore
          localClosestEdge.position === "bottom"
        ) {
          closestParentElement!.insertAdjacentElement(
            "afterend",
            localTemporaryDiv,
          );
          console.log("colocou BOTTOM");

          localTemporaryDiv.appendChild(e.target as HTMLElement);
        } else if (
          parentFlexDirection === "row" &&
          // @ts-ignore
          localClosestEdge.position === "top"
        ) {
          closestParentElement!.insertAdjacentElement(
            "beforebegin",
            localTemporaryDiv,
          );
          console.log("colocou TOP");

          localTemporaryDiv.appendChild(e.target as HTMLElement);
        } else {
          if (temporaryDiv.current) {
            // GET THIS BACK
            // temporaryDiv.current.remove();
            // temporaryDiv.current = null;
            // console.log("removeu");
            // resetPage();
          }
        }

        highlightEdgeIfClose(
          // @ts-ignore
          localClosestEdge.rect[localClosestEdge.position],
          debouncedPosition[
            // @ts-ignore
            localClosestEdge.position === "left" ||
            // @ts-ignore
            localClosestEdge.position === "right"
              ? "x"
              : "y"
          ],
          // @ts-ignore
          localClosestEdge.rect,
          // @ts-ignore
          localClosestEdge.position,
          // @ts-ignore
          localClosestEdge.el,
        );
      }

      const existingHighlight = Array.from(
        previousHighlightedElements.current,
      ).find((el) => el.classList.contains("highlight"));

      if (existingHighlight) {
        const elRect = existingHighlight.getBoundingClientRect();
        const position =
          existingHighlight.style.top || existingHighlight.style.bottom
            ? "y"
            : "x";
        const edge =
          position === "y"
            ? elRect.top || elRect.bottom
            : elRect.left || elRect.right;
        const distance = Math.abs(
          position === "y" ? e.clientY - edge : e.clientX - edge,
        );

        if (distance > 20) {
          clearHighlights();
        } else {
          highlightEdgeIfClose(
            edge,
            position === "y" ? e.clientY : e.clientX,
            elRect,
            position === "y"
              ? elRect.top === edge
                ? "top"
                : "bottom"
              : elRect.left === edge
                ? "left"
                : "right",
            existingHighlight,
          );
        }
      }
    },
  };
};
