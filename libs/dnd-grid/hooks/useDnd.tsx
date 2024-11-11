import {
  addComponent,
  getComponentById,
  getParentId,
  updateComponentPosition,
} from "@/libs/dnd-grid/utils/editor";
import { useRef, useCallback } from "react";
import {
  getGridCoordinates,
  GridCoordinateResult,
} from "@/libs/dnd-grid/utils/engines/position";
import { structureMapper } from "@/utils/componentMapper";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  getBaseElementId,
  getElementByIdInContext,
  getElementRects,
} from "@/libs/dnd-grid/utils/engines/finder";
import { checkOverlap } from "@/libs/dnd-grid/utils/engines/overlap";

export const useDnd = (debug?: string) => {
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isNewComponent = useRef<boolean>(false);
  const animationFrame = useRef<number | null>(null);
  const lastValidGridCoords = useRef<GridCoordinateResult>({
    column: 1,
    row: 1,
    parentId: "main-grid",
  });

  // Cache elementRects to avoid redundant calculations
  const elementRectsCache = useRef<Record<string, DOMRect>>({});

  const onDragStart = useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    const { setIsInteracting, setDraggableComponent, setCoords } =
      useDndGridStore.getState();
    const { root: components } = useEditorTreeStore.getState().tree;

    setIsInteracting(true);

    const el = e.target as HTMLElement;
    const currComponentId = el.getAttribute("data-id") ?? el.getAttribute("id");
    const componentData = getComponentById(components, currComponentId!);

    if (componentData) {
      setDraggableComponent({
        name: componentData.name,
        id: componentData.id,
        props: {
          style: {
            gridColumn: componentData.props?.style?.gridColumn || "",
            gridRow: componentData.props?.style?.gridRow || "",
          },
        },
        // @ts-ignore
        parentId: getParentId(components, currComponentId!) || "",
      });
    } else {
      // Add new components here
      const type = el.getAttribute("data-type");
      if (type) {
        const newComponent = structureMapper()[type].structure({});
        setDraggableComponent(newComponent);
        isNewComponent.current = true;
      }
    }

    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = "copyMove";

    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const parentId = getParentId(components, currComponentId!);

    elementRectsCache.current = getElementRects(currComponentId!, components);
    setCoords({
      gridColumn: componentData?.props?.style?.gridColumn || "",
      gridRow: componentData?.props?.style?.gridRow || "",
      parentId: parentId || "",
    });
  }, []);

  const checkFitsInside = useCallback(
    (movable: HTMLElement, elementRects: Record<string, DOMRect>) => {
      const { root: components } = useEditorTreeStore.getState().tree;
      const movableRect = movable.getBoundingClientRect();
      const fittingElements: string[] = [];

      for (const [key, rect] of Object.entries(elementRects)) {
        const parentComponent = getComponentById(components, key);
        if (
          fitsInside(movableRect, rect) &&
          !parentComponent?.blockDroppingChildrenInside
        ) {
          fittingElements.push(key);
        }
      }

      return fittingElements;
    },
    [],
  );

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      setTree: setComponents,
      tree: editorTree,
      setSelectedComponentIds,
    } = useEditorTreeStore.getState();
    const {
      draggableComponent,
      coords,
      setInvalidComponent,
      setValidComponent,
      setIsInteracting,
    } = useDndGridStore.getState();

    // Reset parentId for specific component types
    if (
      ["Modal", "Drawer", "PopOver"].includes(draggableComponent?.name || "")
    ) {
      coords.parentId = "main-grid";
    }

    const updatingComponent = getElementByIdInContext(draggableComponent!.id!);

    if (updatingComponent) {
      updatingComponent.style.gridColumn = coords.gridColumn;
      updatingComponent.style.gridRow = coords.gridRow;
    }

    updateComponentPosition(
      editorTree.root,
      draggableComponent!.id!.replace("-body", ""),
      coords,
    );
    setSelectedComponentIds(() => [draggableComponent!.id!]);
    setComponents(editorTree, {
      action: `Updated ${draggableComponent?.description} component`,
    });
    setInvalidComponent(null);
    setValidComponent(null);
    setIsInteracting(false);
  }, []);

  const onDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      // Schedule the drag handling within the next animation frame
      animationFrame.current = requestAnimationFrame(() => {
        const { setTree: setComponents, tree: editorTree } =
          useEditorTreeStore.getState();
        const {
          draggableComponent,
          setInvalidComponent,
          setValidComponent,
          setCoords,
        } = useDndGridStore.getState();

        const id = draggableComponent?.id;
        if (!draggableComponent || id === undefined) return;

        const { validComponent, invalidComponent } = useDndGridStore.getState();

        if (isNewComponent.current) {
          const elementId = getBaseElementId().replace("-body", "");
          addComponent(editorTree.root, draggableComponent, elementId);
          setComponents(editorTree, {
            action: `Added ${draggableComponent.description} component`,
          });
          isNewComponent.current = false;
          return;
        }

        const el = getElementByIdInContext(id);
        if (!el) return;

        // If it is over any invalid position, getGridCoordinates is going to throw an error and we will use the last valid coordinates
        try {
          lastValidGridCoords.current = getGridCoordinates(
            id,
            e.clientX - dragOffset.current.x,
            e.clientY - dragOffset.current.y,
          );
        } catch {}

        const {
          column: rawColumn,
          row: rawRow,
          parentId,
        } = lastValidGridCoords.current;

        // Enforce minimum column and row start values
        let column = Math.max(Math.floor(rawColumn), 1);
        let row = Math.max(Math.floor(rawRow), 1);

        const [columnStart, columnEnd] = el.style.gridColumn
          .split("/")
          .map(Number);
        const columnSize = columnEnd - columnStart;
        const [rowStart, rowEnd] = el.style.gridRow.split("/").map(Number);
        const rowSize = rowEnd - rowStart;

        // Enforce maximum column end value
        const maxColumn = 121;
        let columnEndValue = column + columnSize;
        if (columnEndValue > maxColumn) {
          column = maxColumn - columnSize;
          columnEndValue = maxColumn;
        }

        const gridColumn = `${column}/${columnEndValue}`;
        const gridRow = `${row}/${row + rowSize}`;

        // Batch DOM updates to minimize layout thrashing
        el.style.transition = "none"; // Optional: disable transitions during drag for performance
        el.style.gridColumn = gridColumn;
        el.style.gridRow = gridRow;
        moveElement(el, parentId);

        const overlappingIds = checkOverlap(
          el,
          elementRectsCache.current as any,
        );
        const fittingIds = checkFitsInside(
          el,
          elementRectsCache.current as any,
        );

        // check if the elements the draggable overlaps are the same as the elements the draggable fits inside
        if (arraysEqual(overlappingIds, fittingIds)) {
          setCoords({ gridColumn, gridRow, parentId });
          if (invalidComponent !== null) {
            setInvalidComponent(null);
          }
          if (validComponent !== id) {
            setValidComponent(id);
          }
        } else {
          if (invalidComponent !== id) {
            setInvalidComponent(id);
          }
          if (validComponent !== id) {
            setValidComponent(null);
          }
        }
      });
    },
    [checkFitsInside],
  );

  const onDragEnd = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  return {
    onDrop,
    onDragStart,
    onDragOver: useCallback((e: React.DragEvent) => {
      e.preventDefault();
    }, []),
    onDrag,
    onDragEnd,
    onDragLeave: onDragEnd,
  };
};

function fitsInside(innerRect: DOMRect, outerRect: DOMRect) {
  return (
    innerRect.left >= outerRect.left &&
    innerRect.right <= outerRect.right &&
    innerRect.top >= outerRect.top &&
    innerRect.bottom <= outerRect.bottom
  );
}

function moveElement(currentElement: HTMLElement, newParentId: string) {
  const { iframeWindow } = useEditorStore.getState();
  const newParent = iframeWindow?.document.querySelector<HTMLElement>(
    `[id="${newParentId}"], [data-id="${newParentId}"]`,
  );

  if (currentElement && newParent) {
    newParent.appendChild(currentElement);
  }
}

// Utility function to compare two arrays for equality
function arraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
}
