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

      // Remove the preview element if it exists
      const previewElement =
        currentWindow?.document.getElementById("preview-element");
      if (previewElement) {
        previewElement.remove();
      }

      // if (componentToAdd) {
      // const newStyles = updateGridPosition(
      //   componentToAdd.props?.style,
      //   position.current.column,
      //   position.current.row,
      // );
      // componentToAdd.props = { ...componentToAdd.props, style: newStyles };
      //   setComponentToAdd(componentToAdd);

      //   // console.log(
      //   //   "--->",
      //   //   dropTarget2.current,
      //   //   position.current,
      //   //   componentToAdd,
      //   // );
      // }

      const dropTarget = {
        id: dropTarget2.current,
        edge: edge ?? "center",
      } as DropTarget;
      if (activeId) {
        onDrop?.(activeId as string, dropTarget, position.current);
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
    const rawId =
      element?.dataset?.id ?? element?.getAttribute("id") ?? undefined;
    return rawId ? rawId.split("-related-").at(0) : rawId;
  };

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
      const w = currentWindow ?? window;
      const comp =
        w?.document?.querySelector(`[data-id^="${id}"]`) ??
        w?.document?.querySelector(`[id^="${id}"]`);
      const rect = comp?.getBoundingClientRect()!;

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

      const coordinates = getGridCoordinates(
        firstValidParentElement,
        mouseX,
        mouseY,
      );
      // console.log(firstValidParentElement, coordinates);

      // Position updated
      const newStyles = updateGridPosition(
        component.props?.style,
        coordinates.column,
        coordinates.row,
      );

      // Remove any existing preview element
      const existingPreview =
        currentWindow?.document.getElementById("preview-element");
      if (existingPreview) {
        existingPreview.remove();
      }

      // Create and add the new preview element
      const previewElement = currentWindow?.document.createElement("div");
      if (previewElement && currentWindow?.document) {
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

        // const mainContent = currentWindow.document.getElementById('main-content');
        firstValidParentElement!.appendChild(previewElement);
      }

      position.current = {
        gridColumn: newStyles.gridColumn,
        gridRow: newStyles.gridRow,
      };
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

    // Remove the preview element if it exists
    const previewElement =
      currentWindow?.document.getElementById("preview-element");
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
    currentWindow!.document.getElementById("root")!.style.opacity = "1";
    const setIsDragging = useEditorStore.getState().setIsDragging;
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (!event || !isEditorMode) {
      return;
    }

    const { isResizing, setEdge, edge } = useEditorStore.getState();
    if (isResizing) return;

    // Remove the preview element if it exists
    const previewElement =
      currentWindow?.document.getElementById("preview-element");
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
