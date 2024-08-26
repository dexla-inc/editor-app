import { useEditorStore } from "@/stores/editor";
import { useCallback, useRef } from "react";
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
  const dropTarget2 = useRef<any>(null);

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (isResizing) return;

      const setIsDragging = useEditorStore.getState().setIsDragging;

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
      setIsDragging(true);
      const rootElement = w.document.getElementById("root");
      if (rootElement) {
        rootElement.style.opacity = "0.7";
      }
    },
    [id, onDragStart, currentWindow, isResizing, ghostImagePosition],
  );

  const extractComponentBaseId = (element: HTMLElement): string | undefined => {
    const rawId = element.dataset.id ?? element.getAttribute("id") ?? undefined;
    return rawId ? rawId.split("-related-").at(0) : rawId;
  };

  function getGridCoordinates(element: any, x: any, y: any) {
    // console.log(element, x, y);
    const rect = element.getBoundingClientRect();
    const style = currentWindow?.getComputedStyle(element)!;
    const gridColumns = style.gridTemplateColumns.split(" ").length;
    const gridRows = Math.round(rect.height / 10);

    const columnWidth = rect.width / gridColumns;
    const rowHeight = rect.height / gridRows;

    const column = Math.floor((x - rect.left) / columnWidth) + 1;
    const row = Math.floor((y - rect.top) / rowHeight) + 1;

    return { column, row };
  }

  return {
    draggable: true,
    onDragStart: handleDragStart,
    onDrag: (event: any) => {
      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;
      const { clientX: mouseX, clientY: mouseY } = event;
      const comp =
        currentWindow?.document?.querySelector(`[data-id^="${id}"]`) ??
        currentWindow?.document?.querySelector(`[id^="${id}"]`);
      const rect = comp?.getBoundingClientRect()!;
      const elements =
        currentWindow?.document
          .elementsFromPoint(mouseX, mouseY)
          .filter((element) => {
            const comp =
              componentMutableAttrs[
                extractComponentBaseId(element as HTMLElement)!
              ];

            return comp && !comp?.blockDroppingChildrenInside;
          }) || [];
      // console.log(
      //   "---->",
      //   currentWindow?.document.elementsFromPoint(mouseX, mouseY),
      // );
      // const firstValidParentElement = elements.at(0);
      // dropTarget2.current = extractComponentBaseId(
      //   firstValidParentElement as HTMLElement,
      // );
      //
      // if (!mouseX || !mouseY || !rect) return;
      //
      // const coordinates = getGridCoordinates(
      //   firstValidParentElement,
      //   mouseX,
      //   mouseY,
      // );
      // console.log(firstValidParentElement, coordinates);
    },
    onDragEnd: () => {
      console.log("===>END");
    },
  };
};
