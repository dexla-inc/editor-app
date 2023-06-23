import { useEditorStore } from "@/stores/editor";
import {
  Edge,
  leftOfRectangle,
  rightOfRectangle,
  topOfRectangle,
  bottomOfRectangle,
  getClosestEdge,
  distanceBetween,
  DropTarget,
  getComponentById,
} from "@/utils/editor";
import { useState, useCallback } from "react";

export const useDroppable = ({
  id,
  activeId,
  onDrop,
  currentWindow,
}: {
  id: string;
  onDrop: (droppedId: string, dropTarget: DropTarget) => void;
  activeId?: string;
  currentWindow?: Window;
}) => {
  const editorTree = useEditorStore((state) => state.tree);
  const setCurrentTargetId = useEditorStore(
    (state) => state.setCurrentTargetId
  );
  const [edge, setEdge] = useState<Edge>();
  const component = getComponentById(editorTree.root, id);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (activeId !== id && !component?.blockDroppingChildrenInside) {
        const dropTarget = {
          id,
          edge: edge!,
        } as DropTarget;
        onDrop?.(activeId!, dropTarget);
      }
      setCurrentTargetId(undefined);
    },
    [
      activeId,
      id,
      component?.blockDroppingChildrenInside,
      setCurrentTargetId,
      edge,
      onDrop,
    ]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (
        activeId &&
        activeId !== id &&
        !component?.blockDroppingChildrenInside
      ) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const w = currentWindow ?? window;
        const rect = w.document.getElementById(id)?.getBoundingClientRect()!;
        let activeRect = w.document
          .getElementById(activeId)
          ?.getBoundingClientRect()!;

        if (activeRect) {
          activeRect.x = mouseX;
          activeRect.y = mouseY;
        } else {
          activeRect = {
            x: mouseX,
            y: mouseY,
            left: mouseX,
            top: mouseY,
            width: 0,
            height: 0,
          } as DOMRect;
        }

        const leftDist = distanceBetween(leftOfRectangle(rect), activeRect);
        const rigthDist = distanceBetween(rightOfRectangle(rect), activeRect);
        const topDist = distanceBetween(topOfRectangle(rect), activeRect);
        const bottomDist = distanceBetween(bottomOfRectangle(rect), activeRect);

        const { edge } = getClosestEdge(
          leftDist,
          rigthDist,
          topDist,
          bottomDist
        );

        setEdge(edge as Edge);
      }
    },
    [activeId, id, component?.blockDroppingChildrenInside, currentWindow]
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      if (activeId !== id && !component?.blockDroppingChildrenInside) {
        setCurrentTargetId(id);
      }
    },
    [activeId, component?.blockDroppingChildrenInside, id, setCurrentTargetId]
  );

  // TODO: Handle isOver differently to have better ux as currently
  // it remove the drop target even if hovering over a non droppable children
  const handleDragLeave = useCallback((event: any) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    edge,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
  };
};
