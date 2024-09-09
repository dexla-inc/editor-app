import { useEditorStore } from "@/stores/editor";

export function getRelativeBoundingClientRect(element: any, parent: any) {
  const gridParentElement = useEditorStore.getState().gridParentElement;
  if (!parent || !element) return {};

  const elementRect = element.getBoundingClientRect();
  const parentRect =
    gridParentElement === "canvas"
      ? { top: 0, left: 0, x: 0, y: 0 }
      : parent.getBoundingClientRect();

  return {
    top: elementRect.top - parentRect.top,
    right: elementRect.right - elementRect.left,
    bottom: elementRect.bottom - parentRect.top,
    left: elementRect.left - parentRect.left,
    width: elementRect.width,
    height: elementRect.height,
    x: elementRect.x - parentRect.x,
    y: elementRect.y - parentRect.y,
  };
}
