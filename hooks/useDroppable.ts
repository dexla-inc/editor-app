import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  DropTarget,
  Edge,
  getClosestEdge,
  getComponentById,
} from "@/utils/editor";
import { useCallback, useEffect, useState } from "react";

export const useDroppable = ({
  id,
  onDrop,
  currentWindow,
}: {
  id: string;
  onDrop: (droppedId: string, dropTarget: DropTarget) => void;
  activeId?: string;
  currentWindow?: Window;
}) => {
  const editorTree = useEditorStore((state) => state.tree);
  const isPageStructure = useEditorStore((state) => state.isPageStructure);
  const setCurrentTargetId = useEditorStore(
    (state) => state.setCurrentTargetId,
  );
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const activeTab = useEditorStore((state) => state.activeTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const [edge, setEdge] = useState<Edge>();
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const [shouldHandleDragOver, setShouldHandleDragOver] = useState(false);

  const component = getComponentById(editorTree.root, id);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const activeId = useEditorStore.getState().selectedComponentId;
      const dropTarget = {
        id,
        edge: edge!,
      } as DropTarget;
      onDrop?.(activeId!, dropTarget);
      setCurrentTargetId(undefined);
    },
    [id, setCurrentTargetId, edge, onDrop],
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
    if (
      leftDist > threshold &&
      rightDist > threshold &&
      topDist > threshold &&
      bottomDist > threshold &&
      !component?.blockDroppingChildrenInside
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
    ],
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setShouldHandleDragOver(true);
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
    },
    [setActiveTab, activeTab, isTabPinned],
  );

  useEffect(() => {
    if (shouldHandleDragOver) {
      const timeout = setTimeout(() => setCurrentTargetId(id), 20);
      return () => clearTimeout(timeout);
    }
  }, [setCurrentTargetId, id, shouldHandleDragOver]);

  // TODO: Handle isOver differently to have better ux as currently
  // it remove the drop target even if hovering over a non droppable children
  const handleDragLeave = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setShouldHandleDragOver(false);
      setEdge(undefined);
    },
    [setShouldHandleDragOver, setEdge],
  );

  const handleDragEnd = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setEdge(undefined);
    },
    [setEdge],
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
