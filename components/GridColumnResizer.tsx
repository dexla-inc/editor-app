import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";
import { Box } from "@mantine/core";
import { useCallback, useEffect } from "react";

export const GridColumnResizer = () => {
  const setIsResizing = useEditorStore((state) => state.setIsResizing);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const span = component?.props?.span;
  const isColumn = component?.name === "GridColumn";

  console.log({ span, component });

  const calculatePosition = useCallback(() => {
    if (component?.id && !isPreviewMode && isColumn) {
      const canvas = document.getElementById("iframe-canvas");
      const resizer = document.getElementById("right-resizer");
      const comp = iframeWindow?.document.getElementById(component.id);

      if (resizer && comp && canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const resizerRect = resizer.getBoundingClientRect();
        const compRect = comp.getBoundingClientRect();

        resizer.style.top = `${
          canvasRect.top +
          compRect.top +
          compRect.height / 2 -
          resizerRect.height / 2
        }px`;
        resizer.style.left = `${
          canvasRect.left + compRect.left + compRect.width + resizerRect.width
        }px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    component?.id,
    iframeWindow?.document,
    isPreviewMode,
    editorTree.timestamp,
    isColumn,
  ]);

  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  const calculateDistance = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (component?.id && !isPreviewMode && isColumn) {
        const resizer = document.getElementById("right-resizer");
        const comp = iframeWindow?.document.getElementById(component.id);

        if (resizer && comp) {
          const compRect = comp.getBoundingClientRect();

          const draggedDistanceFormStartingPoint = compRect.right - e.clientX;
          const isGoingLeft = draggedDistanceFormStartingPoint > 0;
          const distance = Math.abs(draggedDistanceFormStartingPoint);
          // calculate the number os step in the grid (considering the grid span) for each 20px
          const steps = Math.floor(distance / 20) * span;
          const newSpan = isGoingLeft ? span - steps : span + steps;
          console.log({ distance, isGoingLeft, steps, newSpan, span });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      component?.id,
      iframeWindow?.document,
      isPreviewMode,
      editorTree.timestamp,
      isColumn,
      span,
    ],
  );

  useEffect(() => {
    const el = iframeWindow?.document.querySelector(
      ".iframe-canvas-ScrollArea-viewport",
    );
    el?.addEventListener("scroll", calculatePosition);
    return () => el?.removeEventListener("scroll", calculatePosition);
  }, [calculatePosition, iframeWindow]);

  if (!isColumn || isPreviewMode || !component) {
    return null;
  }

  return (
    <Box
      id="right-resizer"
      bg="teal"
      w="4px"
      h="40px"
      pos="absolute"
      draggable
      onDragStart={() => setIsResizing(true)}
      onDragEnd={() => setIsResizing(false)}
      onDrag={calculateDistance}
      style={{
        cursor: "col-resize",
      }}
    />
  );
};
