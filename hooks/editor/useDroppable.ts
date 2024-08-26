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
  onDrop: (droppedId: string, dropTarget: DropTarget) => void;
  currentWindow?: Window;
}) => {
  const position = useRef<any>(null);
  const dropTarget2 = useRef<any>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      const setIsDragging = useEditorStore.getState().setIsDragging;
      const {
        componentToAdd,
        isResizing,
        setCurrentTargetId,
        setComponentToAdd,
      } = useEditorStore.getState();
      if (isResizing || !isEditorMode) return;
      const edge = useEditorStore.getState().edge;
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const activeId = componentToAdd?.id ?? selectedComponentId;

      event.preventDefault();
      event.stopPropagation();
      console.log(
        "--->",
        dropTarget2.current,
        position.current,
        componentToAdd,
      );

      if (componentToAdd) {
        const newStyles = updateGridPosition(
          componentToAdd.props?.style,
          position.current.column,
          position.current.row,
        );
        componentToAdd.props = { ...componentToAdd.props, style: newStyles };
        setComponentToAdd(componentToAdd);
      }

      const dropTarget = {
        id: dropTarget2.current,
        edge: edge ?? "center",
      } as DropTarget;
      if (activeId) {
        onDrop?.(activeId as string, dropTarget);
      }

      setCurrentTargetId(undefined);
      setIsDragging(false);
      currentWindow!.document.getElementById("root")!.style.opacity = "1";
    },
    [id, onDrop],
  );

  const _handleEdgeSet = (
    distances: {
      leftDist: number;
      rightDist: number;
      topDist: number;
      bottomDist: number;
    },
    threshold: number,
  ) => {
    const { blockDroppingChildrenInside, name: componentName } =
      useEditorTreeStore.getState().componentMutableAttrs[id];
    const { componentToAdd, edge, setEdge } = useEditorStore.getState();
    const { leftDist, rightDist, topDist, bottomDist } = distances;
    const isPopOver = componentToAdd?.name === "PopOver";
    let isAllowed = !blockDroppingChildrenInside || isPopOver;
    if (componentName === "NavLink")
      isAllowed = componentToAdd?.name === "NavLink";

    if (
      leftDist > threshold &&
      rightDist > threshold &&
      topDist > threshold &&
      bottomDist > threshold &&
      isAllowed
    ) {
      // If not within 5 pixels of top and bottom edge, set edge to center.
      if (edge !== "center") {
        setEdge("center");
      }
    } else {
      // Check the closest edge and set it accordingly.
      const { edge: newEdge } = getClosestEdge(
        leftDist,
        rightDist,
        topDist,
        bottomDist,
      );
      if (edge !== newEdge) {
        setEdge(newEdge as Edge);
      }
    }
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
    if (styleObject.gridColumn) {
      styleObject.gridColumn = updateGridValue(
        styleObject.gridColumn,
        newColumnStart,
      );
    }

    // Update gridRow
    if (styleObject.gridRow) {
      styleObject.gridRow = updateGridValue(styleObject.gridRow, newRowStart);
    }

    return styleObject;
  }

  const extractComponentBaseId = (element: HTMLElement): string | undefined => {
    const rawId = element.dataset.id ?? element.getAttribute("id") ?? undefined;
    return rawId ? rawId.split("-related-").at(0) : rawId;
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      const { currentTargetId, isResizing } = useEditorStore.getState();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      )!;
      const componentMutableAttrs =
        useEditorTreeStore.getState().componentMutableAttrs;
      if (isResizing || !isEditorMode) return;

      event.preventDefault();
      event.stopPropagation();

      const { clientX: mouseX, clientY: mouseY } = event;
      const w = currentWindow ?? window;
      const comp =
        w?.document?.querySelector(`[data-id^="${id}"]`) ??
        w?.document?.querySelector(`[id^="${id}"]`);
      const rect = comp?.getBoundingClientRect()!;
      // console.log("1234", comp, currentTargetId);

      const elements =
        w?.document.elementsFromPoint(mouseX, mouseY).filter((element) => {
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

      // const leftDist = mouseX - rect.left;
      // const rightDist = rect.right - mouseX;
      // const topDist = mouseY - rect.top;
      // const bottomDist = rect.bottom - mouseY;

      const currentDraggingElement =
        currentWindow?.document.getElementById(selectedComponentId) ??
        currentWindow?.document.querySelector(
          `[data-id="${selectedComponentId}"]`,
        );

      // const draggingElementStyles = getComputedStyle(currentDraggingElement!);
      // const currentWidth = draggingElementStyles.gridColumn;
      // const currentHeight = draggingElementStyles.gridRow;

      // console.log("====>", draggingElementStyles, currentDraggingElement);

      // if (mouseX <= NAVBAR_WIDTH) {
      //   _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 2);
      // } else {
      //   _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 5);
      // }
      const gridContainer = currentWindow?.document.getElementById("root")!;
      const target = event.target;

      const coordinates = getGridCoordinates(
        firstValidParentElement,
        mouseX,
        mouseY,
      );
      // console.log(firstValidParentElement, coordinates);
      position.current = coordinates;

      // Calculate the grid-based coordinates
      const testRect = gridContainer.getBoundingClientRect();
      const x = event.clientX - testRect.left;
      const y = event.clientY - testRect.top;

      // Calculate the grid column and row
      const gridColumn = Math.floor(x / (testRect.width / 48)) + 1;
      const gridRow = Math.floor(y / 10) + 1;

      // console.log(
      //   `Element dropped over grid coordinates: Column: ${gridColumn}, Row: ${gridRow}`,
      // );

      // updateGridPosition(currentDraggingElement, gridColumn, gridRow);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, currentWindow],
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

    event.preventDefault();
    event.stopPropagation();
    if (edge !== undefined) {
      setEdge(undefined);
    }
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    currentWindow!.document.getElementById("root")!.style.opacity = "1";
    const setIsDragging = useEditorStore.getState().setIsDragging;
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (!event || !isEditorMode) {
      return;
    }

    const { isResizing, setEdge, edge } = useEditorStore.getState();
    if (isResizing) return;

    event.preventDefault();
    event.stopPropagation();
    if (edge !== undefined) {
      setEdge(undefined);
    }
    setIsDragging(false);
  }, []);

  // const handleDrag = (event: React.DragEvent) => {
  //   const gridContainer =
  //     currentWindow?.document.getElementById("iframe-content")!;
  //
  //   // Calculate the grid-based coordinates
  //   const testRect = gridContainer.getBoundingClientRect();
  //   const x = event.clientX - testRect.left;
  //   const y = event.clientY - testRect.top;
  //
  //   // Calculate the grid column and row
  //   const gridColumn = Math.floor(x / (testRect.width / 48)) + 1;
  //   const gridRow = Math.floor(y / 10) + 1;
  //
  //   console.log(
  //     `-Element dropped over grid coordinates: Column: ${gridColumn}, Row: ${gridRow}`,
  //   );
  //   // event.target.style.gridColumn = gridColumn;
  // };

  return {
    // onDrag: handleDrag,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };
};
