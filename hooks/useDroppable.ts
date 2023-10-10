import { useEditorStore } from "@/stores/editor";
import {
  Edge,
  getClosestEdge,
  DropTarget,
  getComponentById,
} from "@/utils/editor";
import { useState, useCallback, useEffect, useMemo } from "react";

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
    (state) => state.setCurrentTargetId,
  );
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const [edge, setEdge] = useState<Edge>();
  const [shouldHandleDragOver, setShouldHandleDragOver] = useState(false);

  const component = getComponentById(editorTree.root, id);

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
    [activeId, id, setCurrentTargetId, edge, onDrop],
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const clientX = event.clientX;
    const clientY = event.clientY;

    if (!clientX || !clientY || !rect || currentTargetId !== id) return;

    if (!component?.blockDroppingChildrenInside) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(centerX - clientX);
      const distY = Math.abs(centerY - clientY);

      if (distX < rect.width / 4 && distY < rect.height / 4) {
        return setEdge("center");
      }
    }

    const leftDist = clientX - rect.left;
    const rightDist = rect.right - clientX;
    const topDist = clientY - rect.top;
    const bottomDist = rect.bottom - clientY;

    const { edge } = getClosestEdge(leftDist, rightDist, topDist, bottomDist);

    setEdge(edge as Edge);
  };

  const w = currentWindow ?? window;
  const rect = useMemo(
    () => w.document.getElementById(id)?.getBoundingClientRect()!,
    [id, w],
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setShouldHandleDragOver(true);
    },
    [setShouldHandleDragOver],
  );

  useEffect(() => {
    if (shouldHandleDragOver) {
      const timeout = setTimeout(() => setCurrentTargetId(id), 100);
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
    },
    [setShouldHandleDragOver],
  );

  return {
    edge,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
  };
};
