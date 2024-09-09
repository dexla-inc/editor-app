import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";

export const useDraggable = ({
  id,
  onDragStart,
  currentWindow: w,
}: {
  id: string;
  onDragStart: (id: string) => void;
  currentWindow: any;
}) => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const gridParentElement = useEditorStore((state) => state.gridParentElement);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const setGridParentElement = useEditorStore(
    (state) => state.setGridParentElement,
  );

  // const windowMap: any = {
  //   canvas: () => currentWindow?.document,
  //   modal: () =>
  //     currentWindow?.document.querySelector(".iframe-canvas-Modal-body"),
  // };

  // const w = windowMap[gridParentElement]();

  const handleDragStart = (event: React.DragEvent) => {
    if (isResizing) return;
    // console.log("not resizing");
    // Remove the preview element if it exists
    const previewElement = w?.querySelector("#preview-element");
    if (previewElement) {
      previewElement.remove();
    }

    const modalBody = iframeWindow?.document.querySelector(
      ".iframe-canvas-Modal-body",
    );

    if (modalBody) {
      setGridParentElement("modal");
    } else {
      setGridParentElement("canvas");
    }

    const setIsDragging = useEditorStore.getState().setIsDragging;
    console.log(w);
    const el = iframeWindow?.document.createElement("div");
    const rect = el?.getBoundingClientRect()!;

    if (rect) {
      event.dataTransfer.setDragImage(new Image(), 0, 0);
      event.dataTransfer.effectAllowed = "copyMove";
    }

    const componentMutableAttrs =
      useEditorTreeStore.getState().componentMutableAttrs;
    const setElementRects = useEditorStore.getState().setElementRects;

    // getting all element rects so we can draw the block state
    const targets = Object.entries(componentMutableAttrs).reduce(
      (acc, [key, attrs]) => {
        if (
          attrs.blockDroppingChildrenInside &&
          !["root", "content-wrapper", "main-content", id].includes(key)
        ) {
          const element =
            w?.querySelector(`[data-id^="${key}"]`) ??
            w?.querySelector(`[id^="${key}"]`);
          if (element) {
            const targetRect = element.getBoundingClientRect();
            acc[key] = targetRect;
          }
        }
        return acc;
      },
      {} as Record<string, DOMRect>,
    );

    setElementRects(targets);

    onDragStart(id);
    setIsDragging(true);
    const rootElement = iframeWindow?.document.getElementById("root");
    if (rootElement) {
      rootElement.style.opacity = "0.7";
    }
  };

  return {
    draggable: id !== "main-content" ? true : false,
    onDragStart: handleDragStart,
  };
};
