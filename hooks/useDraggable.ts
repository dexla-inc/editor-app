import { useCallback } from "react";

export const useDraggable = ({
  id,
  onDragStart,
}: {
  id: string;
  onDragStart: (id: string) => void;
}) => {
  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      const el = document.getElementById(id)!;
      const rect = el?.getBoundingClientRect()!;

      const x = Math.max(
        0,
        Math.round(event.pageX - rect.left - window.scrollX)
      );

      const y = Math.max(
        0,
        Math.round(event.pageY - rect.top - window.scrollY)
      );

      event.dataTransfer.setDragImage(el, x, y);
      event.dataTransfer.effectAllowed = "copyMove";
      onDragStart(id);
    },
    [id, onDragStart]
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};
