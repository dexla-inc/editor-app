import { useState, useRef, useCallback, useEffect } from "react";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { getAllIds } from "@/libs/dnd-grid/utils/editor";
import { checkOverlap } from "@/libs/dnd-grid/utils/engines/overlap";
import { getGridCoordinates } from "@/libs/dnd-grid/utils/engines/position";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { getElementByIdInContext } from "@/libs/dnd-grid/utils/engines/finder";

interface GridCoords {
  gridColumn: string;
  gridRow: string;
}

export const useResize = () => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeDirection = useRef<string>("");
  const resizeStartCoords = useRef<GridCoords>({ gridColumn: "", gridRow: "" });
  const resizeEndCoords = useRef<GridCoords>({ gridColumn: "", gridRow: "" });
  const lastValidGridCoords = useRef<GridCoords>({
    gridColumn: "",
    gridRow: "",
  });
  const parentElement = useRef<HTMLDivElement | null>(null);
  const initialOverlappingElements = useRef<string[]>([]);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  /**
   * Initializes the resizing process by setting up necessary states and references.
   */
  const initializeResize = useCallback(
    (
      direction: string,
      e: React.MouseEvent<HTMLDivElement>,
      currComponentId: string,
    ) => {
      e.preventDefault();
      const { setElementRects, setIsInteracting } = useDndGridStore.getState();
      const {
        tree: editorTree,
        setSelectedComponentIds,
        selectedComponentIds,
      } = useEditorTreeStore.getState();
      const components = editorTree.root;
      const el = iframeWindow?.document.getElementById(currComponentId)!;
      const selectedComponentId = selectedComponentIds?.at(0);

      setIsResizing(true);
      setSelectedComponentIds(() => [currComponentId]);
      setIsInteracting(true);

      const componentStyles = window.getComputedStyle(el);
      resizeDirection.current = direction;
      resizeStartCoords.current = {
        gridColumn: componentStyles.gridColumn,
        gridRow: componentStyles.gridRow,
      };

      lastValidGridCoords.current = { ...resizeStartCoords.current };

      // Determine the parent element based on initial mouse position
      const { parentId } = getGridCoordinates(
        selectedComponentId!,
        e.clientX - 10,
        e.clientY - 10,
      );
      parentElement.current = iframeWindow?.document.getElementById(
        parentId,
      ) as HTMLDivElement;

      // Get bounding rectangles of all other components
      const allIds = getAllIds(components);
      const targets = allIds.reduce<Record<string, DOMRect>>((acc, id) => {
        if (currComponentId !== id) {
          const element = iframeWindow?.document.getElementById(id);
          if (element) {
            acc[id] = element.getBoundingClientRect();
          }
        }
        return acc;
      }, {});
      setElementRects(targets);

      // Store initial overlapping elements to detect new overlaps during resizing
      initialOverlappingElements.current = checkOverlap(el, 5);
    },
    [iframeWindow],
  );

  /**
   * Handles the start of the resize action.
   */
  const handleResizeStart = useCallback(
    (
      direction: string,
      e: React.MouseEvent<HTMLDivElement>,
      currComponentId: string,
    ) => {
      initializeResize(direction, e, currComponentId);
    },
    [initializeResize],
  );

  /**
   * Calculates and applies new grid coordinates based on mouse movement.
   */
  const calculateNewGridCoords = (
    el: HTMLElement,
    column: number,
    row: number,
  ) => {
    const componentStyles = window.getComputedStyle(el);
    let newGridColumn = componentStyles.gridColumn;
    let newGridRow = componentStyles.gridRow;

    if (resizeDirection.current.includes("right")) {
      const [startColumn] = componentStyles.gridColumn.split("/");
      const newEndColumn = Math.max(parseInt(startColumn) + 1, column);
      newGridColumn = `${startColumn}/${newEndColumn}`;
    }
    if (resizeDirection.current.includes("bottom")) {
      const [startRow] = componentStyles.gridRow.split("/");
      const newEndRow = Math.max(parseInt(startRow) + 1, row);
      newGridRow = `${startRow}/${newEndRow}`;
    }
    if (resizeDirection.current.includes("left")) {
      const [, endColumn] = componentStyles.gridColumn.split("/");
      const newStartColumn = Math.min(parseInt(endColumn) - 1, column);
      newGridColumn = `${newStartColumn}/${endColumn}`;
    }
    if (resizeDirection.current.includes("top")) {
      const [, endRow] = componentStyles.gridRow.split("/");
      const newStartRow = Math.min(parseInt(endRow) - 1, row);
      newGridRow = `${newStartRow}/${endRow}`;
    }

    return { newGridColumn, newGridRow };
  };

  /**
   * Handles the resize action by updating the element's grid coordinates.
   */
  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const { selectedComponentIds } = useEditorTreeStore.getState();
      const selectedComponentId = selectedComponentIds?.at(0);
      if (!selectedComponentId) return;

      const el = getElementByIdInContext(selectedComponentId)!;

      const { column, row } = getGridCoordinates(
        selectedComponentId,
        e.clientX,
        e.clientY,
        parentElement.current,
      );

      const { newGridColumn, newGridRow } = calculateNewGridCoords(
        el,
        column,
        row,
      );
      console.log("NEW GRID COORDS", {
        column,
        row,
        newGridColumn,
        newGridRow,
      });
      // Apply new grid coordinates
      el.style.gridColumn = newGridColumn;
      el.style.gridRow = newGridRow;

      // Check for overlaps with other elements
      const currentOverlappingElements = checkOverlap(el, 5);
      const newOverlaps = currentOverlappingElements.filter(
        (id) => !initialOverlappingElements.current.includes(id),
      );

      if (newOverlaps.length > 0) {
        // If new overlaps are found, revert to the last valid coordinates
        el.style.gridColumn = lastValidGridCoords.current.gridColumn;
        el.style.gridRow = lastValidGridCoords.current.gridRow;
      } else {
        // Update the last valid coordinates
        lastValidGridCoords.current = {
          gridColumn: newGridColumn,
          gridRow: newGridRow,
        };
      }

      // Update the resize end coordinates
      resizeEndCoords.current = {
        gridColumn: el.style.gridColumn,
        gridRow: el.style.gridRow,
      };

      console.log("FINAL COORDS", resizeEndCoords.current);
    },
    [isResizing, iframeWindow],
  );

  /**
   * Finalizes the resize action by updating the component size in the store.
   */
  const finalizeResize = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      const { setIsInteracting } = useDndGridStore.getState();
      const {
        tree: editorTree,
        setTree: setComponents,
        selectedComponentIds,
        updateTreeComponentAttrs,
      } = useEditorTreeStore.getState();
      const selectedComponentId = selectedComponentIds?.at(0);

      if (!selectedComponentId) return;

      updateTreeComponentAttrs({
        componentIds: [selectedComponentId],
        attrs: {
          props: {
            style: {
              gridColumn: lastValidGridCoords.current.gridColumn,
              gridRow: lastValidGridCoords.current.gridRow,
            },
          },
        },
      });
      setIsInteracting(false);
    }
  }, [isResizing]);

  /**
   * Sets up event listeners for mouse movements and mouse release during resizing.
   */
  useEffect(() => {
    if (isResizing) {
      iframeWindow?.document.body.addEventListener(
        "mousemove",
        handleResize as any,
      );
      iframeWindow?.document.body.addEventListener("mouseup", finalizeResize);
    }
    return () => {
      iframeWindow?.document.body.removeEventListener(
        "mousemove",
        handleResize as any,
      );
      iframeWindow?.document.body.removeEventListener(
        "mouseup",
        finalizeResize,
      );
    };
  }, [isResizing, handleResize, finalizeResize, iframeWindow]);

  return {
    handleResizeStart,
  };
};
