import { useEffect, useRef, useState } from "react";
import { useDebouncedState } from "@mantine/hooks";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";

interface Position {
  x: number;
  y: number;
}

type UseDebouncedPointerPosition = (
  delay?: number,
) => [React.RefObject<HTMLDivElement>, Position, Position];

export const useDebouncedPointerPosition: UseDebouncedPointerPosition = (
  delay = 300,
) => {
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const setIsDragging = useEditorTreeStore((state) => state.setIsDragging);
  // const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [debouncedPosition, setDebouncedPosition] = useDebouncedState<Position>(
    { x: 0, y: 0 },
    delay,
  );
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    highlightEdges();
  }, [debouncedPosition]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const newPosition: Position = { x: e.clientX, y: e.clientY };
      // setPosition(newPosition);
      setDebouncedPosition(newPosition);
      // highlightEdges(); // Mock function
    };

    const onMouseUp = () => {
      iframeWindow?.document.removeEventListener("mousemove", onMouseMove);
      iframeWindow?.document.removeEventListener("mouseup", onMouseUp);
      clearHighlights(); // Mock function
      clearMargins(); // Mock function
    };

    const onMouseDown = (e: MouseEvent) => {
      if (draggableRef.current) {
        const rect = draggableRef.current.getBoundingClientRect();
        setOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        iframeWindow?.document.addEventListener("mousemove", onMouseMove);
        iframeWindow?.document.addEventListener("mouseup", onMouseUp);
      }
    };

    if (draggableRef.current) {
      draggableRef.current.addEventListener("mousedown", onMouseDown);
    }

    return () => {
      if (draggableRef.current) {
        draggableRef.current.removeEventListener("mousedown", onMouseDown);
      }
    };
  }, [draggableRef, setDebouncedPosition]);

  function highlightEdges() {
    clearHighlights();
    const elements = iframeWindow?.document.elementsFromPoint(
      debouncedPosition.x,
      debouncedPosition.y,
    );
    elements?.forEach((el) => {
      if (el !== iframeWindow?.document.body) {
        const rect = el.getBoundingClientRect();

        highlightEdgeIfClose(rect.left, debouncedPosition.x, rect, "left", el);
        highlightEdgeIfClose(
          rect.right,
          debouncedPosition.x,
          rect,
          "right",
          el,
        );
        highlightEdgeIfClose(rect.top, debouncedPosition.y, rect, "top", el);
        highlightEdgeIfClose(
          rect.bottom,
          debouncedPosition.y,
          rect,
          "bottom",
          el,
        );
      }
    });
  }

  function highlightEdgeIfClose(
    edge: number,
    mouse: number,
    rect: any,
    position: string,
    element: any,
  ) {
    const threshold = 20;
    const distance = Math.abs(edge - mouse);
    if (distance <= threshold) {
      const highlight = iframeWindow?.document.createElement("div")!;
      highlight.className = "highlight";
      highlight.style.position = `absolute`;
      highlight.style.backgroundColor = `rgba(255, 0, 0, 0.5)`;
      const size = threshold - distance;
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
      iframeWindow?.document.body.appendChild(highlight);
    }
  }

  function clearHighlights() {
    iframeWindow?.document
      .querySelectorAll(".highlight")
      .forEach((el) => el.remove());
  }

  function clearMargins() {
    iframeWindow?.document
      .querySelectorAll("form, input, button")
      .forEach((el: any) => {
        el.style.marginLeft = null;
        el.style.marginRight = null;
        el.style.marginTop = null;
        el.style.marginBottom = null;
      });
  }

  return [draggableRef, debouncedPosition, offset];
};
