import { useEditorStore } from "@/stores/editor";
import { Edge, getClosestEdge, DropTarget } from "@/utils/editor";
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
  const setCurrentTargetId = useEditorStore(
    (state) => state.setCurrentTargetId
  );
  const [edge, setEdge] = useState<Edge>();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const dropTarget = {
        id,
        edge: edge!,
      } as DropTarget;
      onDrop?.(activeId!, dropTarget);
      setCurrentTargetId(undefined);
    },
    [activeId, id, setCurrentTargetId, edge, onDrop]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const w = currentWindow ?? window;
      const rect = w.document.getElementById(id)?.getBoundingClientRect()!;

      const leftDist = mouseX - rect.left;
      const rightDist = rect.right - mouseX;
      const topDist = mouseY - rect.top;
      const bottomDist = rect.bottom - mouseY;

      const { edge } = getClosestEdge(leftDist, rightDist, topDist, bottomDist);

      setEdge(edge as Edge);
    },
    [id, currentWindow]
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentTargetId(id);
    },
    [id, setCurrentTargetId]
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
