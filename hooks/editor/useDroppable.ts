import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  DropTarget,
  Edge,
  getClosestEdge,
  getComponentTreeById,
} from "@/utils/editor";
import debounce from "lodash.debounce";
import { useCallback, useRef } from "react";
import {
  isEditorModeSelector,
  selectedComponentIdSelector,
} from "@/utils/componentSelectors";

const debouncedDragEnter = debounce((event: any, id: string) => {
  const isResizing = useEditorStore.getState().isResizing;
  if (isResizing) return;

  const componentToAdd = useEditorStore.getState().componentToAdd;
  const selectedComponentId = selectedComponentIdSelector(
    useEditorTreeStore.getState(),
  );
  const setCurrentTargetId = useEditorStore.getState().setCurrentTargetId;
  const activeTab = useEditorStore.getState().activeTab;
  const setActiveTab = useEditorStore.getState().setActiveTab;
  const isTabPinned = useUserConfigStore.getState().isTabPinned;
  const activeId = componentToAdd?.id ?? selectedComponentId;

  const activeComponent =
    useEditorTreeStore.getState().componentMutableAttrs[activeId!];

  const comp = useEditorTreeStore.getState().componentMutableAttrs[id];
  const isTryingToDropInsideItself =
    activeComponent && activeId !== id
      ? !!getComponentTreeById(activeComponent!, id)
      : false;

  if (id === "root" || id === "content-wrapper") {
    return;
  }

  const isGrid = activeComponent?.name === "Grid";
  const isPopOver = activeComponent?.name === "PopOver";

  const isAllowed = isGrid
    ? componentMapper[
        activeComponent?.name as string
      ].allowedParentTypes?.includes(comp?.name as string)
    : isPopOver
      ? true
      : !comp?.props?.blockDroppingChildrenInside;

  if (!isTryingToDropInsideItself && activeComponent && isAllowed) {
    setCurrentTargetId(id);
  } else if (!activeComponent) {
    setCurrentTargetId(id);
  }

  if (event.clientX > NAVBAR_WIDTH && !isTabPinned) {
    setActiveTab(undefined);
  } else {
    if (
      (isTabPinned && activeTab !== "layers") ||
      (!isTabPinned && activeTab === "layers")
    ) {
      setActiveTab("layers");
    }
  }
}, 100);

export const useDroppable = ({
  id,
  onDrop,
  currentWindow,
}: {
  id: string;
  onDrop: (
    droppedId: string,
    dropTarget: DropTarget,
    position: { gridColumn: number; gridRow: number },
  ) => void;
  currentWindow?: Window;
}) => {
  const position = useRef<any>(null);
  const dropTarget2 = useRef<any>(null);

  const w = currentWindow?.document;

  const handleDrop = (event: React.DragEvent) => {
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    const setIsDragging = useEditorStore.getState().setIsDragging;
    const {
      componentToAdd,
      isResizing,
      setCurrentTargetId,
      setComponentToAdd,
    } = useEditorStore.getState();

    const previewElement = w?.getElementById("preview-element");
    const isPreviewElementOverlapping = previewElement?.dataset.overlapping;

    if (isResizing || !isEditorMode) return;

    if (!isPreviewElementOverlapping) {
      const edge = useEditorStore.getState().edge;
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const activeId = componentToAdd?.id ?? selectedComponentId;

      event.preventDefault();
      event.stopPropagation();

      const dropTarget = {
        id: dropTarget2.current,
        edge: edge ?? "center",
      } as DropTarget;
      if (activeId) {
        onDrop?.(activeId as string, dropTarget, position.current);
      }
    }
    // Remove the preview element if it exists
    if (previewElement) {
      previewElement.remove();
    }

    setCurrentTargetId(undefined);
    setIsDragging(false);
    w!.getElementById("root")!.style.opacity = "1";
  };

  function getGridCoordinates(element: any, x: any, y: any) {
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

  function updateGridPosition(
    styleObject: any,
    newColumnStart: any,
    newRowStart: any,
  ) {
    // Helper function to update a single grid value
    const updateGridValue = (currentValue: any, newStart: any) => {
      const parts = currentValue.split("/").map((part: any) => part.trim());
      const currentStart = parseInt(parts[0], 10);
      const currentEnd = parts[1] ? parseInt(parts[1], 10) : currentStart;

      const diff = currentEnd - currentStart;
      const newEnd = newStart + diff;

      return `${newStart}/${newEnd}`;
    };

    // Update gridColumn
    if (styleObject?.gridColumn) {
      styleObject.gridColumn = updateGridValue(
        styleObject.gridColumn,
        newColumnStart,
      );
    }

    // Update gridRow
    if (styleObject?.gridRow) {
      styleObject.gridRow = updateGridValue(styleObject.gridRow, newRowStart);
    }

    return styleObject;
  }

  const extractComponentBaseId = (element: HTMLElement): string | undefined => {
    const rawId =
      element?.dataset?.id ?? element?.getAttribute("id") ?? undefined;
    return rawId ? rawId.replace("-body", "").split("-related-").at(0) : rawId;
  };

  function checkOverlap(movable: any) {
    const movableRect = movable.getBoundingClientRect();
    const overlappingElements: any[] = [];
    const elementRects = useEditorStore.getState().elementRects;

    Object.entries(elementRects).forEach(([key, rect]) => {
      if (isOverlapping(movableRect, rect)) {
        overlappingElements.push(key);
      }
    });

    return overlappingElements;
  }

  function isOverlapping(rect1: any, rect2: any) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      const { isResizing } = useEditorStore.getState();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;

      if (isResizing || !isEditorMode) return;

      const { componentToAdd } = useEditorStore.getState();
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const selectedComponent =
        useEditorTreeStore.getState().componentMutableAttrs[
          selectedComponentId!
        ];
      const component = componentToAdd ?? selectedComponent;

      event.preventDefault();
      event.stopPropagation();

      const { clientX: mouseX, clientY: mouseY } = event;

      const comp =
        w?.querySelector(`[data-id^="${id}"]`) ??
        w?.querySelector(`[id^="${id}"]`);
      const rect = comp?.getBoundingClientRect()!;

      const elements =
        w?.elementsFromPoint(mouseX, mouseY).filter((element: any) => {
          const comp =
            componentMutableAttrs[
              extractComponentBaseId(element as HTMLElement)!
            ];

          return comp && !comp?.blockDroppingChildrenInside;
        }) || [];

      const firstValidParentElement = elements.at(0);
      dropTarget2.current = extractComponentBaseId(
        firstValidParentElement as HTMLElement,
      );

      if (!mouseX || !mouseY || !rect) return;

      const coordinates = getGridCoordinates(
        firstValidParentElement,
        mouseX,
        mouseY,
      );
      console.log(
        "before",
        component.props?.style,
        coordinates.column,
        coordinates.row,
      );
      // Position updated
      const newStyles = updateGridPosition(
        component.props?.style,
        coordinates.column,
        coordinates.row,
      );

      // Remove any existing preview element
      const existingPreview = w?.getElementById("preview-element");
      if (existingPreview) {
        existingPreview.remove();
      }

      // Create and add the new preview element
      const previewElement = w?.createElement("div");
      if (previewElement && w) {
        previewElement.id = "preview-element";
        // previewElement.style.position = 'absolute';
        previewElement.style.display = "grid";
        previewElement.style.gridTemplateRows = "subgrid";
        previewElement.style.gridTemplateColumns = "subgrid";
        previewElement.style.gridColumn = newStyles.gridColumn;
        previewElement.style.gridRow = newStyles.gridRow;
        previewElement.style.backgroundColor = "rgba(12, 140, 233, 0.12)"; // Semi-transparent blue
        previewElement.style.border = "2px solid #0C8CE9";
        previewElement.style.zIndex = "9990";
        previewElement.style.width = "auto";
        previewElement.style.height = "auto";

        firstValidParentElement!.appendChild(previewElement);
        const overlappingElements = checkOverlap(previewElement);
        if (overlappingElements.length > 0) {
          previewElement.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
          previewElement.style.borderColor = "#DE4040";
          previewElement.dataset.overlapping = "true";
        }
      }
      console.log({
        gridColumn: newStyles.gridColumn,
        gridRow: newStyles.gridRow,
      });
      position.current = {
        gridColumn: newStyles.gridColumn,
        gridRow: newStyles.gridRow,
      };
    },
    [id, w],
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (!isEditorMode) return;
      debouncedDragEnter(event, id);
    },
    [id],
  );

  const handleDragLeave = useCallback((event: any) => {
    const { isResizing, setEdge, edge } = useEditorStore.getState();
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (isResizing || !isEditorMode) return;

    // Remove the preview element if it exists
    const previewElement = w?.getElementById("preview-element");
    if (previewElement) {
      previewElement.remove();
    }

    event.preventDefault();
    event.stopPropagation();
    if (edge !== undefined) {
      setEdge(undefined);
    }
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    w!.getElementById("root")!.style.opacity = "1";
    const setIsDragging = useEditorStore.getState().setIsDragging;
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (!event || !isEditorMode) {
      return;
    }

    const { isResizing, setEdge, edge } = useEditorStore.getState();
    if (isResizing) return;

    // Remove the preview element if it exists
    const previewElement = w?.getElementById("preview-element");
    if (previewElement) {
      previewElement.remove();
    }

    event.preventDefault();
    event.stopPropagation();
    if (edge !== undefined) {
      setEdge(undefined);
    }
    setIsDragging(false);
  }, []);

  return {
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };
};
