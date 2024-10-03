import { useEditorStore } from "../../stores/editor";

const isOverlapping = (
  rect1: DOMRect,
  rect2: DOMRect,
  threshold: number = 0,
): boolean => {
  return !(
    rect1.right + threshold <= rect2.left - threshold ||
    rect1.left - threshold >= rect2.right + threshold ||
    rect1.bottom + threshold <= rect2.top - threshold ||
    rect1.top - threshold >= rect2.bottom + threshold
  );
};

export const checkOverlap = (
  movable: HTMLElement,
  threshold: number = 0,
): string[] => {
  const { elementRects } = useEditorStore.getState();
  const movableRect = movable.getBoundingClientRect();
  const overlappingElements: string[] = [];

  Object.entries(elementRects).forEach(([key, rect]) => {
    if (isOverlapping(movableRect, rect, threshold)) {
      overlappingElements.push(key);
    }
  });

  return overlappingElements;
};
