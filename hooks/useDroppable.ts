import {
  Edge,
  leftOfRectangle,
  rightOfRectangle,
  topOfRectangle,
  bottomOfRectangle,
  getClosestEdge,
  distanceBetween,
  DropTarget,
} from "@/utils/editor";
import { useState, useCallback } from "react";

export const useDroppable = ({
  id,
  activeId,
  onDrop,
}: {
  id: string;
  onDrop: (droppedId: string, dropTarget: DropTarget) => void;
  activeId?: string;
}) => {
  const [isOver, setIsOver] = useState<boolean>(false);
  const [edge, setEdge] = useState<Edge>();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (activeId !== id) {
        const dropTarget = {
          id,
          edge: edge!,
        } as DropTarget;
        onDrop?.(activeId!, dropTarget);
      }
      setIsOver(false);
    },
    [activeId, id, edge, onDrop]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (activeId && activeId !== id) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const rect = document.getElementById(id)?.getBoundingClientRect()!;
        let activeRect = document
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
    [id, activeId]
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      if (activeId !== id) {
        setIsOver(true);
      }
    },
    [activeId, id]
  );

  const handleDragLeave = useCallback((event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOver(false);
  }, []);

  return {
    isOver,
    edge,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
  };
};
