import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  ComponentTree,
  DropTarget,
  Edge,
  getClosestEdge,
  getComponentTreeById,
  getComponentTreeChildrenById,
  updateTree,
} from "@/utils/editor";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import {
  isEditorModeSelector,
  selectedComponentIdSelector,
} from "@/utils/componentSelectors";
import { useDebouncedState } from "@mantine/hooks";

interface Position {
  x: number;
  y: number;
}

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
  const [closestDistance, setClosestDistance] = useState<number | null>(null);
  const [closestSide, setClosestSide] = useState<string>("");
  const isDragging = useEditorTreeStore((state) => !!state.virtualTree);

  const [debouncedPosition, setDebouncedPosition] = useDebouncedState<Position>(
    { x: 0, y: 0 },
    300,
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      const setIsDragging = useEditorTreeStore.getState().setIsDragging;
      const { componentToAdd, isResizing, setCurrentTargetId } =
        useEditorStore.getState();
      if (isResizing || !isEditorMode) return;
      const edge = useEditorStore.getState().edge;
      const selectedComponentId = selectedComponentIdSelector(
        useEditorTreeStore.getState(),
      );
      const activeId = componentToAdd?.id ?? selectedComponentId;

      event.preventDefault();
      event.stopPropagation();
      const dropTarget = {
        id,
        edge: edge ?? "center",
      } as DropTarget;
      if (activeId) {
        onDrop?.(activeId as string, dropTarget);
      }

      setCurrentTargetId(undefined);
      setIsDragging(false);
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

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      const { currentTargetId = "", isResizing } = useEditorStore.getState();
      const { tree } = useEditorTreeStore.getState();
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (isResizing || !isEditorMode) return;

      event.preventDefault();
      event.stopPropagation();

      const w = currentWindow ?? window;
      const currentTargetChildren = getComponentTreeChildrenById(
        tree.root,
        currentTargetId,
      );

      const childrenIds = currentTargetChildren
        .map((c) => `[data-id^="${c.id}"],[id^="${c.id}"]`)
        .join(", ");

      const elements = w?.document.querySelectorAll(childrenIds);
      let closestElement: Element | null = null;
      let closestDistance = Infinity;
      // console.log("===>", currentTargetId, childrenIds, elements);

      elements.forEach((element) => {
        // element.classList.remove(
        //   "edge-left",
        //   "edge-right",
        //   "edge-top",
        //   "edge-bottom",
        // );
        // @ts-ignore
        element.style.setProperty("--gap-size", "0px");

        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        const distance = Math.hypot(
          event.clientX - elementCenterX,
          event.clientY - elementCenterY,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestElement = element;
        }

        if (closestElement) {
          addEdgeClass(closestElement, event.clientX, event.clientY);
        }
      });

      function addEdgeClass(element: Element, x: number, y: number) {
        const rect = element.getBoundingClientRect();
        if (
          x > rect.left &&
          x < rect.right &&
          y > rect.top &&
          y < rect.bottom
        ) {
          // Pointer is inside the element, do not show anything
          return;
        }

        const threshold = 200;

        // const { tree: editorTree, setVirtualTree } =
        //   useEditorTreeStore.getState();

        const distances = [
          { side: "left", distance: Math.abs(x - rect.left) },
          { side: "right", distance: Math.abs(x - rect.right) },
          { side: "top", distance: Math.abs(y - rect.top) },
          { side: "bottom", distance: Math.abs(y - rect.bottom) },
        ];

        const closestDistance =
          Math.floor(Math.min(...distances.map((d) => d.distance)) / 2) * 2;
        if (closestDistance <= threshold) {
          const closestSide: any = distances.find(
            (d) => d.distance === closestDistance,
          )?.side;

          if (!closestSide) {
            return;
          }

          console.log(closestSide, closestDistance);

          element.classList.add(`edge-${closestSide}`);
          // @ts-ignore
          element.style.setProperty("--gap-size", `${closestDistance}px`);
          // console.log(
          //   {
          //     closestSide: `margin${closestSide.charAt(0).toUpperCase() + closestSide.slice(1)}`,
          //   },
          //   element.id,
          // );
          // console.log(
          //   closestSideSet,
          //   closestSide,
          //   closestDistanceSet,
          //   closestDistance,
          // );

          // closestDistanceSet = closestDistance;
          // closestSideSet = closestSide;

          // const style = {
          //   [`margin${closestSide.charAt(0).toUpperCase() + closestSide.slice(1)}`]: `${closestDistance}px`,
          //   "&::after": {
          //     content: '""',
          //     position: "absolute",
          //     backgroundColor: "red",
          //     zIndex: 1000,
          //     display: "block",
          //     width: ["top", "bottom"].includes(closestSide)
          //       ? "100%"
          //       : `${closestDistance}px`,
          //     height: !["top", "bottom"].includes(closestSide)
          //       ? "100%"
          //       : `${closestDistance}px`,
          //     [closestSide]: `calc(-1 * ${closestDistance}px)`,
          //   },
          // };
          // const newTreeRoot = updateTree(editorTree.root, element.id, {
          //   props: { style },
          // });
          // // console.log(style);
          // setVirtualTree(newTreeRoot);
        }
      }

      // const { clientX: mouseX, clientY: mouseY } = event;
      //
      // const comp =
      //   w?.document?.querySelector(`[data-id^="${id}"]`) ??
      //   w?.document?.querySelector(`[id^="${id}"]`);
      // const rect = comp?.getBoundingClientRect()!;
      //
      // if (!mouseX || !mouseY || !rect || currentTargetId !== id) return;
      //
      // const leftDist = mouseX - rect.left;
      // const rightDist = rect.right - mouseX;
      // const topDist = mouseY - rect.top;
      // const bottomDist = rect.bottom - mouseY;
      //
      // if (mouseX <= NAVBAR_WIDTH) {
      //   _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 2);
      // } else {
      //   _handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 5);
      // }
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

  function clearHighlights() {
    currentWindow?.document
      .querySelectorAll(".highlight")
      .forEach((el) => el.remove());
  }

  const handleDragEnd = useCallback((event: any) => {
    const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
    if (!event || !isEditorMode) {
      return;
    }

    const { isResizing, setEdge, edge } = useEditorStore.getState();
    if (isResizing) return;

    event.preventDefault();
    event.stopPropagation();
    clearHighlights();
    console.log("RODOU");
    if (edge !== undefined) {
      setEdge(undefined);
    }
  }, []);

  const highlightEdges = () => {
    const elements = currentWindow?.document.elementsFromPoint(
      debouncedPosition.x,
      debouncedPosition.y,
    );
    elements?.forEach((el) => {
      if (el !== currentWindow?.document.body) {
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
  };

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
      const highlight = currentWindow?.document.createElement("div")!;
      highlight.className = "highlight";
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
      currentWindow?.document.body.appendChild(highlight);
    }
  }

  const onDrag = (e: MouseEvent) => {
    console.log({ x: e.clientX, y: e.clientY });
    if (isDragging) {
      setDebouncedPosition({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    console.log(debouncedPosition);
    highlightEdges();
  }, [debouncedPosition]);

  return {
    onDrop: handleDrop,
    onDragOver: (e: any) => {
      e.preventDefault();
    },
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragEnd: handleDragEnd,
    // onDrag: onDrag,
  };
};
