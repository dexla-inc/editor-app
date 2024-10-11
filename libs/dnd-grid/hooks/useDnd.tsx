import {
  addComponent,
  getAllIds,
  getComponentById,
  getParentId,
  updateComponentPosition,
} from "@/libs/dnd-grid/utils/editor";
import { useRef } from "react";
import {
  getElementsOver,
  getGridCoordinates,
} from "@/libs/dnd-grid/utils/engines/position";
import { structureMapper } from "@/libs/dnd-grid/utils/componentMapper";
import { cloneObject } from "@/utils/common";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";

export const useDnd = (debug?: string) => {
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isNewComponent = useRef<boolean>(false);

  const getElementRects = (currComponentId: string) => {
    const { root: components } = useEditorTreeStore.getState().tree;
    const { iframeWindow } = useEditorStore.getState();

    const allIds = getAllIds(components, {
      filterFromParent: currComponentId,
    });
    const targets = allIds.reduce(
      (acc, id) => {
        if (currComponentId !== id) {
          const element = iframeWindow?.document.getElementById(id);
          if (element) {
            const targetRect = element.getBoundingClientRect();
            acc[id] = targetRect;
          }
        }
        return acc;
      },
      {} as Record<string, DOMRect>,
    );
    return targets;
  };

  const onDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    const { setIsInteracting, setDraggableComponent, setCoords } =
      useDndGridStore.getState();
    const { root: components } = useEditorTreeStore.getState().tree;

    setIsInteracting(true);

    const el = e.target as HTMLElement;
    const currComponentId = el.getAttribute("id");
    const componentData = getComponentById(components, currComponentId!);

    if (componentData) {
      setDraggableComponent({
        name: componentData?.name,
        id: componentData?.id,
        props: {
          style: {
            gridColumn: componentData?.props?.style?.gridColumn || "",
            gridRow: componentData?.props?.style?.gridRow || "",
          },
        },
        // @ts-ignore
        parentId: getParentId(components, currComponentId!) || "",
      });
    } else {
      // add new components here
      const type = el.getAttribute("data-type");
      if (type) {
        const newComponent = structureMapper[type].structure({});
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

    setCoords({
      gridColumn: componentData?.props?.style?.gridColumn || "",
      gridRow: componentData?.props?.style?.gridRow || "",
      parentId: parentId || "",
    });
  };

  function checkOverlap(movable: any, elementRects: any) {
    const movableRect = movable.getBoundingClientRect();
    const overlappingElements: any[] = [];

    Object.entries(elementRects).forEach(([key, rect]) => {
      if (isOverlapping(movableRect, rect)) {
        overlappingElements.push(key);
      }
    });

    return overlappingElements;
  }

  function checkFitsInside(movable: any, elementRects: any) {
    const { root: components } = useEditorTreeStore.getState().tree;

    const movableRect = movable.getBoundingClientRect();
    const overlappingElements: any[] = [];

    Object.entries(elementRects).forEach(([key, rect]) => {
      const parentComponent = getComponentById(components, key);
      if (
        fitsInside(movableRect, rect) &&
        !parentComponent?.blockDroppingChildrenInside
      ) {
        overlappingElements.push(key);
      }
    });

    return overlappingElements;
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      setTree: setComponents,
      tree: editorTree,
      setSelectedComponentIds,
    } = useEditorTreeStore.getState();
    const { iframeWindow } = useEditorStore.getState();
    const {
      draggableComponent,
      coords,
      setInvalidComponent,
      setValidComponent,
    } = useDndGridStore.getState();

    const updatingComponent = iframeWindow?.document.getElementById(
      draggableComponent!.id!,
    )!;
    updatingComponent.style.gridColumn = coords.gridColumn;
    updatingComponent.style.gridRow = coords.gridRow;

    updateComponentPosition(editorTree.root, draggableComponent!.id!, coords);
    setSelectedComponentIds(() => [draggableComponent?.id!]);
    setComponents(editorTree, {
      action: `Updated ${draggableComponent?.description} component`,
    });
    setInvalidComponent(null);
    setValidComponent(null);
  };

  const onDrag = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { setTree: setComponents, tree: editorTree } =
      useEditorTreeStore.getState();
    const { iframeWindow } = useEditorStore.getState();
    const {
      draggableComponent,
      setInvalidComponent,
      setValidComponent,
      setCoords,
    } = useDndGridStore.getState();

    const elementsOver = getElementsOver(e.clientX, e.clientY);
    if (!elementsOver.find((item) => item.id === "main-grid")) {
      return;
    }

    const { validComponent, invalidComponent } = useDndGridStore.getState();
    const { id } = draggableComponent!;

    if (isNewComponent.current) {
      addComponent(editorTree.root, draggableComponent!, "main-grid");
      await setComponents(editorTree, {
        action: `Added ${draggableComponent?.description} component`,
      });
      isNewComponent.current = false;
      return;
    }

    const el = iframeWindow?.document.getElementById(id!)!;

    const {
      column: rawColumn,
      row: rawRow,
      parentId,
    } = getGridCoordinates(
      id || "",
      e.clientX - dragOffset.current.x,
      e.clientY - dragOffset.current.y,
    );

    // Enforce minimum column and row start values
    let column = Math.max(rawColumn, 0);
    let row = Math.max(rawRow, 0);

    console.log("column", column, "row", row);

    const [columnStart, columnEnd] = el.style.gridColumn.split("/");
    const columnSize = parseInt(columnEnd) - parseInt(columnStart);
    const [rowStart, rowEnd] = el.style.gridRow.split("/");
    const rowSize = parseInt(rowEnd) - parseInt(rowStart);

    // Enforce maximum column end value
    const maxColumn = 121;
    let columnEndValue = column + columnSize;
    if (columnEndValue > maxColumn) {
      column = maxColumn - columnSize;
      columnEndValue = maxColumn;
    }

    const gridColumn = `${column}/${columnEndValue}`;
    const gridRow = `${row}/${row + rowSize}`;

    el.style.gridColumn = gridColumn;
    el.style.gridRow = gridRow;
    moveElement(id!, parentId);

    const elementRects = getElementRects(id!);

    const overlappingIds = checkOverlap(el, elementRects);
    const fittingIds = checkFitsInside(el, elementRects);

    if (JSON.stringify(overlappingIds) === JSON.stringify(fittingIds)) {
      setCoords({ gridColumn, gridRow, parentId });
      invalidComponent !== null && setInvalidComponent(null);
      validComponent !== id && setValidComponent(id!);
    } else {
      invalidComponent !== id && setInvalidComponent(id!);
      validComponent !== id && setValidComponent(null);
    }
  };

  const onDragEnd = () => {
    const { setIsInteracting, setInvalidComponent, setValidComponent } =
      useDndGridStore.getState();
    setIsInteracting(false);
    setInvalidComponent(null);
    setValidComponent(null);
  };

  return { onDrop, onDragStart, onDragOver, onDrag, onDragEnd };
};

export function isOverlapping(rect1: any, rect2: any) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function fitsInside(innerRect: any, outerRect: any) {
  return (
    innerRect.left >= outerRect.left &&
    innerRect.right <= outerRect.right &&
    innerRect.top >= outerRect.top &&
    innerRect.bottom <= outerRect.bottom
  );
}

function moveElement(elementId: string, newParentId: string) {
  const { iframeWindow } = useEditorStore.getState();
  const element = iframeWindow?.document.getElementById(elementId);
  const newParent = iframeWindow?.document.getElementById(newParentId);

  if (element && newParent) {
    newParent.appendChild(element);
  }
}
