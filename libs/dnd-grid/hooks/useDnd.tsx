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
import { structureMapper } from "@/utils/componentMapper";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  getBaseElementId,
  getElementByIdInContext,
} from "@/libs/dnd-grid/utils/engines/finder";

export const useDnd = (debug?: string) => {
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isNewComponent = useRef<boolean>(false);

  const { root: components } = useEditorTreeStore.getState().tree;

  /**
   * Retrieves an element by ID using the context utilities.
   *
   * @param id - The ID of the element to retrieve.
   * @returns The HTMLElement if found; otherwise, null.
   */
  const getElementById = (id: string): HTMLElement | null => {
    const element = getElementByIdInContext(id);
    if (debug) {
      console.log({ element, id }, element?.constructor.name);
    }
    return element;
  };

  const getElementRects = (currComponentId: string) => {
    const allIds = getAllIds(components, {
      filterFromParent: currComponentId,
    });
    const targets = allIds.reduce(
      (acc, id) => {
        if (currComponentId !== id) {
          const element = getElementById(id);
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
      console.log(getParentId(components, currComponentId!));
    } else {
      // add new components here
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

    setCoords({
      gridColumn: componentData?.props?.style?.gridColumn || "",
      gridRow: componentData?.props?.style?.gridRow || "",
      parentId: parentId || "",
    });
  };

  function checkOverlap(
    movable: HTMLElement,
    elementRects: Record<string, DOMRect>,
  ) {
    const movableRect = movable.getBoundingClientRect();
    const overlappingElements: string[] = [];

    Object.entries(elementRects).forEach(([key, rect]) => {
      if (isOverlapping(movableRect, rect)) {
        overlappingElements.push(key);
      }
    });

    return overlappingElements;
  }

  function checkFitsInside(
    movable: HTMLElement,
    elementRects: Record<string, DOMRect>,
  ) {
    const { root: components } = useEditorTreeStore.getState().tree;

    const movableRect = movable.getBoundingClientRect();
    const fittingElements: string[] = [];

    Object.entries(elementRects).forEach(([key, rect]) => {
      const parentComponent = getComponentById(components, key);
      if (
        fitsInside(movableRect, rect) &&
        !parentComponent?.blockDroppingChildrenInside
      ) {
        fittingElements.push(key);
      }
    });

    return fittingElements;
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
    const {
      draggableComponent,
      coords,
      setInvalidComponent,
      setValidComponent,
    } = useDndGridStore.getState();

    const updatingComponent = getElementById(draggableComponent!.id!);
    console.log("updatingComponent", updatingComponent);
    if (updatingComponent) {
      updatingComponent.style.gridColumn = coords.gridColumn;
      updatingComponent.style.gridRow = coords.gridRow;
    }
    console.log("DROP", coords);
    updateComponentPosition(editorTree.root, draggableComponent!.id!, coords);
    setSelectedComponentIds(() => [draggableComponent!.id!]);
    setComponents(editorTree, {
      action: `Updated ${draggableComponent?.description} component`,
    });
    setInvalidComponent(null);
    setValidComponent(null);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { setTree: setComponents, tree: editorTree } =
      useEditorTreeStore.getState();
    const {
      draggableComponent,
      setInvalidComponent,
      setValidComponent,
      setCoords,
    } = useDndGridStore.getState();
    // console.log("======1");
    const elementsOver = getElementsOver(e.clientX, e.clientY);
    if (!elementsOver.find((item) => item.id === "main-grid")) {
      return;
    }
    // console.log("======2");
    const { validComponent, invalidComponent } = useDndGridStore.getState();
    const { id } = draggableComponent!;

    if (isNewComponent.current) {
      const elementId = getBaseElementId().replace("-body", "");
      // console.log("NEW COMPONENT", elementId);
      addComponent(editorTree.root, draggableComponent!, elementId);
      setComponents(editorTree, {
        action: `Added ${draggableComponent?.description} component`,
      });
      isNewComponent.current = false;
      return;
    }
    // console.log("======3");
    const el = getElementById(id!);

    if (!el) return;

    const {
      column: rawColumn,
      row: rawRow,
      parentId,
    } = getGridCoordinates(
      id!,
      e.clientX - dragOffset.current.x,
      e.clientY - dragOffset.current.y,
    );

    // Enforce minimum column and row start values
    let column = Math.max(rawColumn, 0);
    let row = Math.max(rawRow, 0);

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
      if (invalidComponent !== null) {
        setInvalidComponent(null);
      }
      if (validComponent !== id) {
        setValidComponent(id!);
      }
    } else {
      if (invalidComponent !== id) {
        setInvalidComponent(id!);
      }
      if (validComponent !== id) {
        setValidComponent(null);
      }
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

export function isOverlapping(rect1: DOMRect, rect2: DOMRect) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function fitsInside(innerRect: DOMRect, outerRect: DOMRect) {
  return (
    innerRect.left >= outerRect.left &&
    innerRect.right <= outerRect.right &&
    innerRect.top >= outerRect.top &&
    innerRect.bottom <= outerRect.bottom
  );
}

function moveElement(elementId: string, newParentId: string) {
  const { iframeWindow } = useEditorStore.getState();

  // Reuse the getElementByIdInContext utility
  const getElementById = (id: string): HTMLElement | null => {
    if (!iframeWindow?.document) return null;

    const modalBody = iframeWindow.document.querySelector(
      ".iframe-canvas-Modal-body",
    );
    const baseElement = modalBody
      ? (modalBody as HTMLElement)
      : iframeWindow.document;

    if (baseElement instanceof Document) {
      return baseElement.getElementById(id);
    } else if (baseElement instanceof HTMLElement) {
      return baseElement.querySelector<HTMLElement>(`#${id}`);
    }

    return null;
  };

  const element = getElementById(elementId);
  const newParent = getElementById(newParentId);

  if (element && newParent) {
    newParent.appendChild(element);
  }
}
