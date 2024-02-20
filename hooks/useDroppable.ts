import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  DropTarget,
  Edge,
  getClosestEdge,
  getComponentById,
} from "@/utils/editor";
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";

const debouncedDragEnter = debounce((event: any, id: string) => {
  const isResizing = useEditorStore.getState().isResizing;
  if (isResizing) return;

  const editorTree = useEditorStore.getState().tree;
  const componentToAdd = useEditorStore.getState().componentToAdd;
  const selectedComponentId = useEditorStore.getState().selectedComponentId;
  const setCurrentTargetId = useEditorStore.getState().setCurrentTargetId;
  const activeTab = useEditorStore.getState().activeTab;
  const setActiveTab = useEditorStore.getState().setActiveTab;
  const isTabPinned = useUserConfigStore.getState().isTabPinned;
  const activeId = componentToAdd?.id ?? selectedComponentId;

  const activeComponent = getComponentById(editorTree.root, activeId!);

  const comp = getComponentById(editorTree.root, id);
  const isTryingToDropInsideItself =
    activeComponent && activeId !== id
      ? !!getComponentById(activeComponent!, id)
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
  const editorTree = useEditorStore((state) => state.tree);
  const isPageStructure = useEditorStore((state) => state.isPageStructure);
  const setCurrentTargetId = useEditorStore(
    (state) => state.setCurrentTargetId,
  );
  const isResizing = useEditorStore((state) => state.isResizing);
  const [edge, setEdge] = useState<Edge>();
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const componentToAdd = useEditorStore((state) => state.componentToAdd);
  const component = getComponentById(editorTree.root, id);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      if (isResizing) return;
      const selectedComponentId = useEditorStore.getState().selectedComponentId;
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
    },
    [isResizing, componentToAdd?.id, id, edge, setCurrentTargetId, onDrop],
  );

  const handleEdgeSet = (
    distances: {
      leftDist: number;
      rightDist: number;
      topDist: number;
      bottomDist: number;
    },
    threshold: number,
  ) => {
    const { leftDist, rightDist, topDist, bottomDist } = distances;
    const isPopOver = componentToAdd?.name === "PopOver";
    let isAllowed = !component?.blockDroppingChildrenInside || isPopOver;
    if (component?.name === "NavLink")
      isAllowed = componentToAdd?.name === "NavLink";

    if (
      leftDist > threshold &&
      rightDist > threshold &&
      topDist > threshold &&
      bottomDist > threshold &&
      isAllowed
    ) {
      // If not within 5 pixels of top and bottom edge, set edge to center.
      setEdge("center");
    } else {
      // Check the closest edge and set it accordingly.
      const { edge } = getClosestEdge(leftDist, rightDist, topDist, bottomDist);
      setEdge(edge as Edge);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      if (isResizing) return;

      event.preventDefault();
      event.stopPropagation();

      const { clientX: mouseX, clientY: mouseY } = event;
      const w = currentWindow ?? window;
      const rect = w.document.getElementById(id)?.getBoundingClientRect()!;

      if (!mouseX || !mouseY || !rect || currentTargetId !== id) return;

      const leftDist = mouseX - rect.left;
      const rightDist = rect.right - mouseX;
      const topDist = mouseY - rect.top;
      const bottomDist = rect.bottom - mouseY;

      if (isPageStructure && mouseX <= NAVBAR_WIDTH) {
        handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 2);
      } else {
        handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 5);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      id,
      currentWindow,
      currentTargetId,
      component?.blockDroppingChildrenInside,
      isResizing,
      isPageStructure,
    ],
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      debouncedDragEnter(event, id);
    },
    [id],
  );

  const handleDragLeave = useCallback(
    (event: any) => {
      if (isResizing) return;

      event.preventDefault();
      event.stopPropagation();
      setEdge(undefined);
    },
    [setEdge, isResizing],
  );

  const handleDragEnd = useCallback(
    (event: any) => {
      if (isResizing) return;

      event.preventDefault();
      event.stopPropagation();
      setEdge(undefined);
    },
    [setEdge, isResizing],
  );

  return {
    edge,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };
};
